import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CreditCard, Wallet, Loader2 } from "lucide-react";

import {
  getStudentHostelFees,
  getHostelRooms, // This function now takes seasonId
  validateHostelBookingForPayment,
  HostelFeeData,
  HostelRoom, // Now includes currentOccupancy
  PreparedHostelBookingData,
  initializeHostelBookingStripePayment,
  verifyPaystackHostelBookingPayment,
  verifyFlutterwaveBookingPayment,
} from '@/services/hostelApiService';

import { useAuth } from '@/contexts/AuthContext';

import PaystackPop from "@paystack/inline-js";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

const formSchema = z.object({
  hostelFeeId: z.string().min(1, { message: "Please select a hostel block" }),
  roomId: z.string().min(1, { message: "Please select a room" }),
});

const HostelBookingForm = () => {
  const { user, loading: authLoading } = useAuth();
  const [hostelFees, setHostelFees] = useState<HostelFeeData[]>([]);
  const [selectedHostelFeeDetail, setSelectedHostelFeeDetail] = useState<HostelFeeData | null>(null);
  const [availableRooms, setAvailableRooms] = useState<HostelRoom[]>([]);
  const [isLoadingFees, setIsLoadingFees] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"paystack" | "stripe" | "flutterwave" | null>(null);

  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

  const [preparedBooking, setPreparedBooking] = useState<PreparedHostelBookingData | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hostelFeeId: "",
      roomId: "",
    },
  });

  useEffect(() => {
    const fetchHostelFees = async () => {
      if (!user || authLoading) return;

      try {
        setIsLoadingFees(true);
        const response = await getStudentHostelFees(1, 50);

        if (response?.data?.hostelFees) {
          setHostelFees(response.data.hostelFees);
        } else {
            console.warn("API response for hostel fees did not contain expected data.data.hostelFees array:", response);
            setHostelFees([]);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load hostel options');
        console.error('Error fetching hostel fees:', error);
      } finally {
        setIsLoadingFees(false);
      }
    };
    
    if (!authLoading && user?.id) {
        fetchHostelFees();
    }
  }, [user?.id, authLoading]);

  const groupedHostels = hostelFees.reduce((acc, fee) => {
    const hostelId = fee.hostel.id;
    if (!acc[hostelId]) {
      acc[hostelId] = {
        hostel: fee.hostel,
        fees: [],
        season: fee.season,
      };
    }
    acc[hostelId].fees.push(fee);
    return acc;
  }, {} as Record<number, { hostel: HostelFeeData['hostel']; fees: HostelFeeData[]; season: HostelFeeData['season'] }>);

  const hostelOptions = Object.values(groupedHostels);

  const watchHostelFeeId = form.watch("hostelFeeId");
  const watchRoomId = form.watch("roomId");

  useEffect(() => {
    if (watchHostelFeeId) {
      const selectedFee = hostelFees.find(f => f.id.toString() === watchHostelFeeId);
      setSelectedHostelFeeDetail(selectedFee || null);

      if (selectedFee) {
        // Pass seasonId to fetchRooms
        fetchRooms(selectedFee.hostel.id, selectedFee.season.id);
      }

      form.setValue("roomId", "");
      setPreparedBooking(null);
      
    } else {
      setSelectedHostelFeeDetail(null);
      setAvailableRooms([]);
      form.setValue("roomId", "");
      setPreparedBooking(null);
    }
  }, [watchHostelFeeId, hostelFees, form]);

  // Function to fetch available rooms for a given hostel ID and season
  const fetchRooms = async (hostelId: number, seasonId: number) => {
    try {
      setIsLoadingRooms(true);
      const response = await getHostelRooms(hostelId, seasonId); // Pass seasonId
      if (response?.data?.rooms) {
        // Filter rooms to only show physically available ones AND those with capacity left
        setAvailableRooms(response.data.rooms.filter(room => 
          room.isAvailable && (room.currentOccupancy || 0) < room.capacity
        ));
      } else {
        console.warn("API response for hostel rooms did not contain expected data.data.rooms array:", response);
        setAvailableRooms([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load rooms');
      setAvailableRooms([]);
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedHostelFeeDetail) {
      toast.error("Please select a valid hostel block first.");
      return;
    }
    if (!user?.id) {
        toast.error("User not authenticated. Please login again.");
        return;
    }
    
    if (isProcessingBooking) return;

    console.log("FRONTEND: Form submission initiated - validating booking.");

    try {
      setIsProcessingBooking(true);
      
      const bookingRequestData = {
        hostelId: selectedHostelFeeDetail.hostel.id,
        roomId: parseInt(values.roomId),
        seasonId: selectedHostelFeeDetail.season.id,
        hostelFeeListId: selectedHostelFeeDetail.id,
      };

      console.log("FRONTEND: Calling validateHostelBookingForPayment with data:", bookingRequestData);

      const preparedData = await validateHostelBookingForPayment(bookingRequestData);

      setPreparedBooking(preparedData);
      console.log("FRONTEND: Booking validated successfully. Prepared booking data:", preparedData);
      setSelectedPaymentMethod(null);
      setShowPaymentDialog(true);

    } catch (error: any) {
      console.error('FRONTEND: Full Error preparing booking:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to prepare hostel booking. Please try again.');
    } finally {
      setIsProcessingBooking(false);
    }
  };

  const initiatePayment = async () => {
    console.log("FRONTEND: Payment initiation button clicked.");
    if (!preparedBooking) {
        toast.error("No prepared booking found. Please complete the booking form first.");
        setShowPaymentDialog(false);
        return;
    }
    
    if (!selectedHostelFeeDetail || !selectedPaymentMethod || !user?.email || !user?.name) {
        toast.error("Payment prerequisites missing. Please check form selections and user data.");
        setShowPaymentDialog(false); 
        return;
    }

    if (isInitiatingPayment) return;

    try {
      setIsInitiatingPayment(true);
      const bookingDetails = preparedBooking;
      const userDetails = { email: user.email, name: user.name };

      console.log("FRONTEND: Initiating payment via", selectedPaymentMethod, "for booking details:", bookingDetails);

      switch (selectedPaymentMethod) {
          case 'stripe':
              const stripeSession = await initializeHostelBookingStripePayment(bookingDetails, userDetails, 'STRIPE');
              if (stripeSession.sessionId) {
                  const stripe = await loadStripe(STRIPE_PUBLIC_KEY!);
                  if (!stripe) throw new Error("Stripe.js failed to load.");
                  console.log("FRONTEND: Redirecting to Stripe Checkout for session ID:", stripeSession.sessionId);
                  const { error } = await stripe.redirectToCheckout({ sessionId: stripeSession.sessionId });
                  if (error) throw new Error(error.message || "Failed to redirect to Stripe Checkout.");
              } else {
                  throw new Error("Stripe session ID was not returned from the backend.");
              }
              break;

          case 'paystack':
              const paystack = new PaystackPop();
              paystack.newTransaction({
                  key: PAYSTACK_PUBLIC_KEY!,
                  email: userDetails.email,
                  amount: bookingDetails.amountDue * 100,
                  ref: `UMS_HB_${Date.now()}_${bookingDetails.studentId}`,
                  onSuccess: async (transaction) => {
                      try {
                          toast.loading("Payment successful! Verifying Paystack transaction...", { duration: 0 });
                          await verifyPaystackHostelBookingPayment(transaction.reference, bookingDetails);
                          toast.dismiss(); toast.success("Hostel payment verified successfully!");
                          handlePostPaymentSuccess();
                      } catch (verificationError: any) {
                          toast.dismiss(); toast.error(verificationError.message || 'Paystack verification failed. Please contact support.');
                      }
                  },
                  onClose: () => {
                      toast.error("Payment cancelled by user. Please try again.");
                  },
              });
              break;

          case 'flutterwave':
            const flutterwaveConfig = {
                public_key: FLUTTERWAVE_PUBLIC_KEY!,
                tx_ref: `UMS_HB_${Date.now()}_${bookingDetails.studentId}`,
                amount: bookingDetails.amountDue,
                currency: 'NGN',
                payment_options: 'card,banktransfer,ussd',
                customer: userDetails,
                customizations: {
                    title: 'University Hostel Booking',
                    description: `Hostel booking for ${selectedHostelFeeDetail.hostel.name} - Room ${selectedRoom?.roomNumber || ''} (${selectedHostelFeeDetail.season.name} session)`,
                    logo: '',
                },
            };
            const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig);
            
            handleFlutterwavePayment({
                callback: async (response) => {
                    closePaymentModal();
                    if (response.status === "successful") {
                        try {
                            toast.loading("Payment successful! Verifying Flutterwave transaction...", { duration: 0 });
                            await verifyFlutterwaveBookingPayment(String(response.transaction_id), response.tx_ref, bookingDetails);
                            toast.dismiss(); toast.success("Hostel payment verified successfully!");
                            handlePostPaymentSuccess();
                        } catch (verificationError: any) {
                            toast.dismiss(); toast.error(verificationError.message || 'Flutterwave verification failed. Please contact support.');
                        }
                    } else {
                        toast.error("Payment was not completed.");
                    }
                },
                onClose: () => {
                    toast.error("Payment modal closed by user.");
                },
            });
            break;

          default:
              toast.error("Invalid payment method selected.");
              setShowPaymentDialog(false);
              break;
      }
    } catch (error: any) {
      console.error('FRONTEND: Error initiating payment:', error);
      toast.error(error.response?.data?.message || `Failed to initiate ${selectedPaymentMethod || 'payment'} payment. Please try again.`);
      setShowPaymentDialog(false);
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  const handlePostPaymentSuccess = () => {
      form.reset();
      setPreparedBooking(null);
      setSelectedHostelFeeDetail(null);
      if (selectedHostelFeeDetail) {
          fetchRooms(selectedHostelFeeDetail.hostel.id, selectedHostelFeeDetail.season.id);
      }
      setAvailableRooms([]);
      setShowPaymentDialog(false);
      setSelectedPaymentMethod(null);
      toast.success("Hostel accommodation successfully paid and booked!");
  };

  const selectedRoom = availableRooms.find(room => room.id.toString() === watchRoomId);

  if (isLoadingFees || authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading hostel options...</span>
      </div>
    );
  }

  if (hostelFees.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-lg">
        <p className="text-muted-foreground">No hostel accommodations available for your current season.</p>
        <p className="text-sm text-muted-foreground mt-2">Please contact the hostel administration for more information.</p>
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Hostel Block Selection */}
          <FormField
            control={form.control}
            name="hostelFeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Hostel Block</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setPreparedBooking(null);
                  }}
                  value={field.value}
                  disabled={isProcessingBooking || isInitiatingPayment}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a hostel block" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hostelOptions.map((option) => (
                      <SelectItem
                        key={option.fees[0].id}
                        value={option.fees[0].id.toString()}
                      >
                        {option.hostel.name} - ₦{option.fees[0].amount.toLocaleString()}
                        {option.hostel.gender && ` (${option.hostel.gender})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Showing hostels available for the current season
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedHostelFeeDetail && (
            <div className="bg-card rounded-lg border border-border p-4 space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{selectedHostelFeeDetail.hostel.name}</h3>
                {selectedHostelFeeDetail.description && (
                  <p className="text-sm text-muted-foreground">{selectedHostelFeeDetail.description}</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Season:</span>
                    <p className="font-medium">{selectedHostelFeeDetail.season.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fee Amount:</span>
                    <p className="font-semibold text-primary">₦{selectedHostelFeeDetail.amount.toLocaleString()}</p>
                  </div>
                  {selectedHostelFeeDetail.hostel.gender && (
                    <div>
                      <span className="text-muted-foreground">Gender:</span>
                      <p className="font-medium capitalize">{selectedHostelFeeDetail.hostel.gender.toLowerCase()}</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
          )}

          {/* Room Selection */}
          {selectedHostelFeeDetail && (
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Room</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                    disabled={isLoadingRooms || availableRooms.length === 0 || isProcessingBooking || isInitiatingPayment}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingRooms
                            ? "Loading rooms..."
                            : availableRooms.length === 0
                            ? "No rooms available"
                            : "Select a room"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem
                          key={room.id}
                          value={room.id.toString()}
                          disabled={!room.isAvailable || (room.currentOccupancy || 0) >= room.capacity}
                        >
                          Room {room.roomNumber} - Capacity: {room.capacity}
                          {room.currentOccupancy !== undefined && ` (${room.currentOccupancy}/${room.capacity} booked)`}
                          {!room.isAvailable && " (Physically Unavailable)"}
                          {(room.currentOccupancy || 0) >= room.capacity && " (Full for this Season)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Available rooms in {selectedHostelFeeDetail.hostel.name}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid || isLoadingRooms || isProcessingBooking || isInitiatingPayment || !user?.email || !user?.name}
          >
            {isProcessingBooking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing Booking...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </form>
      </Form>

      {/* Payment Method Selection Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Hostel Booking Payment</DialogTitle>
            <DialogDescription>
              {selectedHostelFeeDetail && selectedRoom && preparedBooking && (
                <>
                    A booking for Room <span className="font-medium">{selectedRoom.roomNumber}</span> in <span className="font-medium">{selectedHostelFeeDetail.hostel.name}</span> has been prepared. <br/>
                </>
              )}
              Choose your preferred payment method below.
            </DialogDescription> {/* <<< FIX: Changed /CardDescription to /DialogDescription >>> */}
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {selectedHostelFeeDetail && selectedRoom && preparedBooking && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hostel:</span>
                  <span className="text-sm font-medium">{selectedHostelFeeDetail.hostel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Room:</span>
                  <span className="text-sm font-medium">Room {selectedRoom.roomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Season:</span>
                  <span className="text-sm font-medium">{selectedHostelFeeDetail.season.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-sm font-semibold">Amount Due:</span>
                  <span className="text-lg font-bold text-primary">₦{preparedBooking.amountDue.toLocaleString()}</span>
                </div>
              </div>
            )}

            <RadioGroup
              value={selectedPaymentMethod || ""}
              onValueChange={(value: "paystack" | "stripe" | "flutterwave") => setSelectedPaymentMethod(value)}
              className="grid grid-cols-1 gap-3"
            >
              {/* Paystack Option */}
              <div
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors ${selectedPaymentMethod === "paystack" ? "border-primary bg-primary/5" : ""}`}
                onClick={() => !isInitiatingPayment && setSelectedPaymentMethod("paystack")}
              >
                <RadioGroupItem value="paystack" id="paystack" checked={selectedPaymentMethod === "paystack"} disabled={isInitiatingPayment} />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="paystack" className="flex items-center space-x-2 cursor-pointer">
                  <CreditCard className="h-5 w-5" />
                    <span>Pay with Paystack</span>
                  </label>
                  <img src="https://paystack.com/assets/img/logo/paystack-logo-vector.svg" alt="Paystack" className="h-6" />
                </div>
              </div>
              {/* Stripe Option */}
              <div
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors ${selectedPaymentMethod === "stripe" ? "border-primary bg-primary/5" : ""}`}
                onClick={() => !isInitiatingPayment && setSelectedPaymentMethod("stripe")}
              >
                <RadioGroupItem value="stripe" id="stripe" checked={selectedPaymentMethod === "stripe"} disabled={isInitiatingPayment} />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="stripe" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Stripe</span>
                  </label>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                </div>
              </div>
              {/* Flutterwave Option */}
              <div
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors ${selectedPaymentMethod === "flutterwave" ? "border-primary bg-primary/5" : ""}`}
                onClick={() => !isInitiatingPayment && setSelectedPaymentMethod("flutterwave")}
              >
                <RadioGroupItem value="flutterwave" id="flutterwave" checked={selectedPaymentMethod === "flutterwave"} disabled={isInitiatingPayment} />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="flutterwave" className="flex items-center space-x-2 cursor-pointer">
                    <Wallet className="h-5 w-5" />
                    <span>Pay with Flutterwave</span>
                  </label>
                  <img src="https://cdn.filestackcontent.com/OITnhSPCSzOuiw9ohCBG" alt="Flutterwave" className="h-6" />
                </div>
              </div>
            </RadioGroup>

            {isInitiatingPayment && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Initiating payment...</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              disabled={isInitiatingPayment}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={initiatePayment}
              disabled={!selectedPaymentMethod || isInitiatingPayment}
              className="w-full sm:w-auto"
            >
              {isInitiatingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Payment...
                </>
              ) : `Pay Now`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostelBookingForm;