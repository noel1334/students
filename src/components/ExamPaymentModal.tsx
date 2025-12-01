// src/components/ExamPaymentModal.tsx

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import PaystackPop from "@paystack/inline-js";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useAuth } from '@/contexts/AuthContext';
import { verifyPaystackExamPayment, verifyFlutterwaveExamPayment } from '@/services/examPaymentApiService';

interface ExamPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: number;
  examTitle: string;
  amount: number;
  // This callback will be used to refresh the data on the parent page
  onPaymentSuccess: () => void;
}

const ExamPaymentModal = ({
  open,
  onOpenChange,
  examId,
  examTitle,
  amount,
  onPaymentSuccess
}: ExamPaymentModalProps) => {
  const { user } = useAuth();
  const [selectedGateway, setSelectedGateway] = useState<'PAYSTACK' | 'FLUTTERWAVE'>('PAYSTACK');
  const [loading, setLoading] = useState(false);

  const handlePaymentFailure = (error: any, gateway: string) => {
    setLoading(false);
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
    toast.error(`${gateway} Payment Failed`, { description: errorMessage });
  };
  
  const handleSuccess = () => {
    setLoading(false);
    toast.success("Payment Verified!", { description: "Your exam fee payment has been successfully recorded." });
    onPaymentSuccess(); // This will trigger a data refresh on the ExamAssignments page
    onOpenChange(false); // Close the modal
  };

  const initiatePaystackPayment = () => {
    if (!user?.email) return handlePaymentFailure({ message: "User email not found." }, "Paystack");
    
    const paystack = new PaystackPop();
    paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY!,
        email: user.email,
        amount: amount * 100, // Amount in Kobo
        ref: `UMS_EXAM_${examId}_${Date.now()}`,
        onSuccess: async (transaction) => {
            try {
                toast.info("Payment completed, now verifying...");
                await verifyPaystackExamPayment(transaction.reference, { examId });
                handleSuccess();
            } catch (verificationError) {
                handlePaymentFailure(verificationError, 'Paystack Verification');
            }
        },
        onCancel: () => {
            setLoading(false); // Stop loading if user cancels
            toast.info("Payment was cancelled.");
        },
    });
  };

  const flutterwaveConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: `UMS_EXAM_${examId}_${Date.now()}`,
    amount,
    currency: 'NGN',
    payment_options: 'card,banktransfer,ussd',
    customer: {
        email: user?.email || '',
        name: user?.name || '',
        phone_number: (user as any)?.phone || '08000000000',
    },
    customizations: {
        title: "UMS Exam Fee Payment",
        description: `Payment for: ${examTitle}`,
        logo: '/lovable-uploads/7383ea93-4c04-4010-aab8-ce6d9fcba973.png',
    },
  };

  const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig);

  const initiateFlutterwavePayment = () => {
    if (!user?.email) return handlePaymentFailure({ message: "User email not found." }, "Flutterwave");

    handleFlutterwavePayment({
        callback: async (response) => {
            closePaymentModal();
            if (response.status === "successful") {
                try {
                    toast.info("Payment completed, now verifying...");
                    await verifyFlutterwaveExamPayment(String(response.transaction_id), flutterwaveConfig.tx_ref, { examId });
                    handleSuccess();
                } catch (verificationError) {
                    handlePaymentFailure(verificationError, "Flutterwave Verification");
                }
            } else {
                handlePaymentFailure({ message: "Payment was not completed." }, "Flutterwave");
            }
        },
        onClose: () => {
            if (loading) {
               setLoading(false); // Stop loading if user closes modal
               toast.info("Payment modal was closed.");
            }
        },
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    if (selectedGateway === 'PAYSTACK') {
      initiatePaystackPayment();
    } else if (selectedGateway === 'FLUTTERWAVE') {
      initiateFlutterwavePayment();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ====================================================================== */}
      {/* === THIS IS THE UI PART THAT WAS MISSING FROM YOUR RENDER           === */}
      {/* ====================================================================== */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exam Fee Payment Required</DialogTitle>
          <DialogDescription>
            Complete payment to download your exam pass for {examTitle}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Payment must be completed to generate your exam pass.
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount to Pay:</span>
              <span className="text-2xl font-bold text-primary">₦{amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Payment Method</Label>
            <RadioGroup value={selectedGateway} onValueChange={(value) => setSelectedGateway(value as 'PAYSTACK' | 'FLUTTERWAVE')} className="gap-2">
              <Label htmlFor="paystack" className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-accent has-[input:checked]:border-primary">
                <RadioGroupItem value="PAYSTACK" id="paystack" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium">
                    <CreditCard className="h-4 w-4" /> Paystack
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pay with card, bank, or USSD.</p>
                </div>
              </Label>

              <Label htmlFor="flutterwave" className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-accent has-[input:checked]:border-primary">
                <RadioGroupItem value="FLUTTERWAVE" id="flutterwave" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium">
                    <CreditCard className="h-4 w-4" /> Flutterwave
                  </div>
                   <p className="text-xs text-muted-foreground mt-1">Pay with card, bank, or mobile money.</p>
                </div>
              </Label>
            </RadioGroup>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Payment
            </Button>
          </div>
      </DialogContent>
      {/* ====================================================================== */}
    </Dialog>
  );
};

export default ExamPaymentModal;