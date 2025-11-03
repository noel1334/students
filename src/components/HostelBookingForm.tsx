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
import { getStudentHostelFees, getHostelRooms, createHostelBooking, HostelFeeData, HostelRoom } from '@/services/hostelApiService';

// Schema for the form validation
const formSchema = z.object({
  hostelFeeId: z.string().min(1, { message: "Please select a hostel block" }),
  roomId: z.string().min(1, { message: "Please select a room" }),
  paymentMethod: z.enum(["paystack", "stripe", "flutterwave"])
});

const HostelBookingForm = () => {
  const [hostelFees, setHostelFees] = useState<HostelFeeData[]>([]);
  const [selectedHostelFee, setSelectedHostelFee] = useState<HostelFeeData | null>(null);
  const [availableRooms, setAvailableRooms] = useState<HostelRoom[]>([]);
  const [isLoadingFees, setIsLoadingFees] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"paystack" | "stripe" | "flutterwave" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hostelFeeId: "",
      roomId: "",
      paymentMethod: "paystack",
    },
  });

  // Fetch hostel fees on component mount
  useEffect(() => {
    const fetchHostelFees = async () => {
      try {
        setIsLoadingFees(true);
        const response = await getStudentHostelFees(1, 50);
        setHostelFees(response.data.hostelFees);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load hostel options');
        console.error('Error fetching hostel fees:', error);
      } finally {
        setIsLoadingFees(false);
      }
    };

    fetchHostelFees();
  }, []);

  // Group hostel fees by hostel for better display
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

  // Watch hostel fee selection
  const watchHostelFeeId = form.watch("hostelFeeId");
  const watchRoomId = form.watch("roomId");

  // Fetch rooms when hostel fee is selected
  useEffect(() => {
    if (watchHostelFeeId) {
      const selectedFee = hostelFees.find(f => f.id.toString() === watchHostelFeeId);
      setSelectedHostelFee(selectedFee || null);
      
      if (selectedFee) {
        fetchRooms(selectedFee.hostel.id);
      }
      
      // Reset room selection when hostel changes
      form.setValue("roomId", "");
    } else {
      setSelectedHostelFee(null);
      setAvailableRooms([]);
    }
  }, [watchHostelFeeId, hostelFees]);

  const fetchRooms = async (hostelId: number) => {
    try {
      setIsLoadingRooms(true);
      const response = await getHostelRooms(hostelId);
      setAvailableRooms(response.data.rooms);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load rooms');
      setAvailableRooms([]);
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  // Handler for form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setShowPaymentDialog(true);
  };

  // Handle payment method selection and booking
  const handlePaymentMethodSelect = async (method: "paystack" | "stripe" | "flutterwave") => {
    setSelectedPaymentMethod(method);
    form.setValue("paymentMethod", method);
    
    try {
      setIsSubmitting(true);
      const values = form.getValues();
      
      await createHostelBooking({
        hostelId: selectedHostelFee!.hostel.id,
        roomId: parseInt(values.roomId),
        hostelFeeListId: parseInt(values.hostelFeeId),
      });
      
      toast.success("Hostel booking successful!", {
        description: `Your room has been booked. Redirecting to ${method} for payment...`,
      });
      
      // Reset form and close dialog
      setTimeout(() => {
        form.reset();
        setShowPaymentDialog(false);
        setSelectedPaymentMethod(null);
        setSelectedHostelFee(null);
        setAvailableRooms([]);
      }, 1500);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the selected room details
  const selectedRoom = availableRooms.find(room => room.id.toString() === watchRoomId);

  if (isLoadingFees) {
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
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a hostel block" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hostelOptions.map((option) => (
                      <SelectItem 
                        key={option.hostel.id} 
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
          
          {/* Show Hostel Details if a hostel is selected */}
          {selectedHostelFee && (
            <div className="bg-card rounded-lg border border-border p-4 space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{selectedHostelFee.hostel.name}</h3>
                {selectedHostelFee.description && (
                  <p className="text-sm text-muted-foreground">{selectedHostelFee.description}</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Season:</span>
                    <p className="font-medium">{selectedHostelFee.season.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fee Amount:</span>
                    <p className="font-semibold text-primary">₦{selectedHostelFee.amount.toLocaleString()}</p>
                  </div>
                  {selectedHostelFee.hostel.gender && (
                    <div>
                      <span className="text-muted-foreground">Gender:</span>
                      <p className="font-medium capitalize">{selectedHostelFee.hostel.gender.toLowerCase()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Room Selection */}
          {selectedHostelFee && (
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Room</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingRooms || availableRooms.length === 0}
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
                          disabled={!room.isAvailable}
                        >
                          Room {room.roomNumber} - Capacity: {room.capacity}
                          {!room.isAvailable && " (Not Available)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Available rooms in {selectedHostelFee.hostel.name}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!form.formState.isValid || isLoadingRooms || isSubmitting}
          >
            {isLoadingRooms ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Rooms...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </form>
      </Form>
      
      {/* Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to complete your hostel booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            {selectedHostelFee && selectedRoom && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hostel:</span>
                  <span className="text-sm font-medium">{selectedHostelFee.hostel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Room:</span>
                  <span className="text-sm font-medium">Room {selectedRoom.roomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Season:</span>
                  <span className="text-sm font-medium">{selectedHostelFee.season.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-sm font-semibold">Amount Due:</span>
                  <span className="text-lg font-bold text-primary">₦{selectedHostelFee.amount.toLocaleString()}</span>
                </div>
              </div>
            )}
            
            <RadioGroup defaultValue="paystack" className="grid grid-cols-1 gap-3">
              <div 
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors ${selectedPaymentMethod === "paystack" ? "border-primary bg-primary/5" : ""}`}
                onClick={() => !isSubmitting && handlePaymentMethodSelect("paystack")}
              >
                <RadioGroupItem value="paystack" id="paystack" checked={selectedPaymentMethod === "paystack"} disabled={isSubmitting} />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="paystack" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Paystack</span>
                  </label>
                  <img src="https://paystack.com/assets/img/logo/paystack-logo-vector.svg" alt="Paystack" className="h-6" />
                </div>
              </div>
              <div 
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors ${selectedPaymentMethod === "stripe" ? "border-primary bg-primary/5" : ""}`}
                onClick={() => !isSubmitting && handlePaymentMethodSelect("stripe")}
              >
                <RadioGroupItem value="stripe" id="stripe" checked={selectedPaymentMethod === "stripe"} disabled={isSubmitting} />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="stripe" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Stripe</span>
                  </label>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                </div>
              </div>
              <div 
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors ${selectedPaymentMethod === "flutterwave" ? "border-primary bg-primary/5" : ""}`}
                onClick={() => !isSubmitting && handlePaymentMethodSelect("flutterwave")}
              >
                <RadioGroupItem value="flutterwave" id="flutterwave" checked={selectedPaymentMethod === "flutterwave"} disabled={isSubmitting} />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="flutterwave" className="flex items-center space-x-2 cursor-pointer">
                    <Wallet className="h-5 w-5" />
                    <span>Pay with Flutterwave</span>
                  </label>
                  <img src="https://cdn.filestackcontent.com/OITnhSPCSzOuiw9ohCBG" alt="Flutterwave" className="h-6" />
                </div>
              </div>
            </RadioGroup>
            
            {isSubmitting && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing booking...</span>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostelBookingForm;
