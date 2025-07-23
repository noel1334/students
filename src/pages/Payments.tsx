
import React, { useState, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import PaymentStatus from '@/components/PaymentStatus';
import { SchoolFeeGatewaySelector } from '@/components/payment/SchoolFeeGatewaySelector';
import { SchoolFeePaymentSummary } from '@/components/payment/SchoolFeePaymentSummary';
import { getCurrentSchoolFees } from '@/services/schoolFeeApiService';
import {
  createSchoolFeeStripeSession,
  verifyPaystackSchoolFeePayment,
  verifyFlutterwaveSchoolFeePayment,
  deleteIncompleteSchoolFeePayment,
  SchoolFeePaymentPayload
} from '@/services/schoolFeePaymentApiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard, Download, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import PaystackPop from '@paystack/inline-js';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

type GatewayKey = 'flutterwave' | 'paystack' | 'stripe';

const Payments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState('1st');
  const [selectedSession, setSelectedSession] = useState('2023/2024');
  const [selectedGateway, setSelectedGateway] = useState<GatewayKey | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const receiptRef = useRef(null);

  const { data: schoolFeesResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['current-school-fees'],
    queryFn: getCurrentSchoolFees,
  });

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Payment_Receipt_${selectedSession}_${selectedSemester}`,
  });

  const handlePaymentSuccess = useCallback(async () => {
    setIsProcessing(false);
    toast({
      title: "Payment Successful!",
      description: "Your school fee payment has been successfully processed.",
    });
    await refetch(); // Refresh the school fees data
  }, [refetch, toast]);

  const handlePaymentFailure = useCallback((error: any, gateway: string) => {
    setIsProcessing(false);
    const errorMessage = typeof error === 'string' ? error : (error.response?.data?.message || error.message || "An unknown error occurred.");
    toast({
      title: `${gateway} Payment Failed`,
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);

  const createPaymentDetailsPayload = (channel: GatewayKey): SchoolFeePaymentPayload => ({
    feeId: schoolFeesResponse?.data?.items[0]?.id || 0,
    amount: schoolFeesResponse?.data?.totalAmount || 0,
    paymentChannel: channel.toUpperCase() as 'FLUTTERWAVE' | 'PAYSTACK' | 'STRIPE',
    purpose: 'SCHOOL_FEE',
  });

  const handleStripePayment = async () => {
    let paymentReference: string | null = null;
    try {
      if (!user || !schoolFeesResponse?.data) {
        throw new Error("Missing user or fee details for Stripe payment.");
      }

      if (!user.email) {
        throw new Error("User email is not available for Stripe payment. Please update your profile.");
      }

      const userEmail: string = user.email;
      const userName: string = user.name || user.regNo || "Student";
      const payload = createPaymentDetailsPayload('stripe');

      const { sessionId, reference } = await createSchoolFeeStripeSession(
        payload.feeId,
        payload.amount,
        payload.paymentChannel,
        payload.purpose,
        userEmail,
        userName
      );

      paymentReference = reference;

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
      if (!stripe) throw new Error("Stripe.js failed to load.");

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        if (paymentReference) {
          await deleteIncompleteSchoolFeePayment(paymentReference);
        }
        throw new Error(error.message || "Failed to redirect to Stripe.");
      }
    } catch (error) {
      handlePaymentFailure(error, "Stripe");
    } finally {
      if (paymentReference === null) {
        setIsProcessing(false);
      }
    }
  };

  const handlePaystackPayment = () => {
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: user!.email!,
      amount: (schoolFeesResponse?.data?.totalAmount || 0) * 100,
      ref: `SCH_${Date.now()}`,
      onSuccess: async (transaction) => {
        try {
          toast({ title: "Payment Successful, Verifying..." });
          const paymentDetails = createPaymentDetailsPayload('paystack');
          await verifyPaystackSchoolFeePayment(transaction.reference, paymentDetails);
          await handlePaymentSuccess();
        } catch (verificationError) {
          handlePaymentFailure(verificationError, 'Paystack');
        }
      },
      onCancel: () => {
        handlePaymentFailure("Payment was cancelled.", 'Paystack');
      },
    });
  };

  const handleFlutterwavePayment = useFlutterwave({
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `SCH_${Date.now()}`,
    amount: Number(schoolFeesResponse?.data?.totalAmount || 0),
    currency: 'NGN',
    payment_options: 'card,banktransfer,ussd',
    customer: {
      email: user!.email!,
      phone_number: user!.phoneNumber || '08000000000', // Add required phone_number
      name: user!.name || user!.regNo || "Student",
    },
    customizations: {
      title: 'School Fee Payment',
      description: 'Payment for school fees',
      logo: '', // Add required logo property (empty string for now)
    },
  });

  const onFlutterwaveVerify = async (response: any) => {
    closePaymentModal();
    if (response.status === "successful") {
      try {
        toast({ title: "Payment Successful, Verifying..." });
        const paymentDetails = createPaymentDetailsPayload('flutterwave');
        await verifyFlutterwaveSchoolFeePayment(
          String(response.transaction_id),
          `SCH_${Date.now()}`,
          paymentDetails
        );
        await handlePaymentSuccess();
      } catch (verificationError) {
        handlePaymentFailure(verificationError, "Flutterwave");
      }
    } else {
      handlePaymentFailure("Payment was not completed by the user.", "Flutterwave");
    }
  };

  const renderPaymentButton = () => {
    if (!selectedGateway) {
      return (
        <Button className="w-full" disabled>
          <CreditCard className="h-4 w-4 mr-2" />
          Select a Gateway
        </Button>
      );
    }

    if (isProcessing) {
      return (
        <Button className="w-full" disabled>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </Button>
      );
    }

    const totalAmount = schoolFeesResponse?.data?.totalAmount || 0;
    if (totalAmount === 0) {
      return (
        <Button className="w-full" disabled>
          <CreditCard className="h-4 w-4 mr-2" />
          No Outstanding Fees
        </Button>
      );
    }

    const buttonText = `Pay ₦${totalAmount.toLocaleString()}`;

    switch (selectedGateway) {
      case 'stripe':
        return (
          <Button
            className="w-full"
            onClick={() => {
              setIsProcessing(true);
              handleStripePayment();
            }}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {buttonText} with Stripe
          </Button>
        );
      case 'paystack':
        return (
          <Button
            className="w-full"
            onClick={() => {
              setIsProcessing(true);
              handlePaystackPayment();
            }}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {buttonText} with Paystack
          </Button>
        );
      case 'flutterwave':
        return (
          <Button
            className="w-full"
            onClick={() => {
              setIsProcessing(true);
              handleFlutterwavePayment({
                callback: onFlutterwaveVerify,
                onClose: () => {
                  handlePaymentFailure("Payment modal closed by user.", "Flutterwave");
                },
              });
            }}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {buttonText} with Flutterwave
          </Button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading payment details...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Payment Dashboard</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1 lg:col-span-2 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar size={18} className="text-primary" /> 
                  Payment Receipt
                </CardTitle>
                <CardDescription>View and download your payment receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                      <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st">1st Semester</SelectItem>
                          <SelectItem value="2nd">2nd Semester</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                      <Select value={selectedSession} onValueChange={setSelectedSession}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Session" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023/2024">2023/2024</SelectItem>
                          <SelectItem value="2022/2023">2022/2023</SelectItem>
                          <SelectItem value="2021/2022">2021/2022</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="hover:bg-primary/10 border-primary text-primary hover:text-primary"
                  >
                    <Download size={16} className="mr-2" />
                    Download Receipt
                  </Button>
                </div>
                
                <div className="hidden">
                  <div ref={receiptRef} className="p-4 print:p-10 bg-white rounded-lg">
                    <div className="text-center mb-8 border-b pb-4">
                      <h2 className="text-3xl font-bold">University Name</h2>
                      <p className="text-gray-500 mt-1 text-xl">Official Payment Receipt</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-2">
                        <p className="text-gray-800"><span className="font-semibold">Student ID:</span> STD123456</p>
                        <p className="text-gray-800"><span className="font-semibold">Full Name:</span> John Doe</p>
                        <p className="text-gray-800"><span className="font-semibold">Department:</span> Computer Science</p>
                        <p className="text-gray-800"><span className="font-semibold">Program:</span> Bachelor of Science</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-800"><span className="font-semibold">Academic Session:</span> {selectedSession}</p>
                        <p className="text-gray-800"><span className="font-semibold">Semester:</span> {selectedSemester}</p>
                        <p className="text-gray-800"><span className="font-semibold">Date Issued:</span> {new Date().toLocaleDateString()}</p>
                        <p className="text-gray-800"><span className="font-semibold">Receipt No:</span> RCP-{Math.floor(100000 + Math.random() * 900000)}</p>
                      </div>
                    </div>
                    
                    <PaymentStatus />
                    
                    <div className="mt-8 border-t pt-6 text-center">
                      <p className="text-gray-600 font-medium mb-1">This is an official receipt. Thank you for your payment.</p>
                      <p className="text-xs text-gray-500">For inquiries, please contact the accounts department at accounts@university.edu</p>
                    </div>

                    <div className="mt-10">
                      <div className="mt-16 border-t pt-2 flex justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Student Signature</p>
                          <div className="mt-6 border-t border-gray-300 w-32"></div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Authorized Signature</p>
                          <div className="mt-6 border-t border-gray-300 w-32"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <PaymentStatus />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <SchoolFeePaymentSummary
                schoolFeesData={schoolFeesResponse?.data || null}
                renderPaymentButton={renderPaymentButton}
              />
              
              <Card className="shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Gateway</CardTitle>
                  <CardDescription>Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <SchoolFeeGatewaySelector
                    gateways={['flutterwave', 'paystack', 'stripe']}
                    selectedGateway={selectedGateway}
                    onSelectGateway={setSelectedGateway}
                    isProcessing={isProcessing}
                  />
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2 p-3 border border-yellow-300 bg-yellow-50 rounded-md w-full">
                    <AlertCircle size={18} className="text-yellow-600 shrink-0" />
                    <p className="text-sm text-yellow-700">
                      Payment deadline: June 30, 2024. Late payments incur a 5% penalty fee.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
