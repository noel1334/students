import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initializePayment } from '@/services/examPaymentApiService';
import { toast } from 'sonner';

interface ExamPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: number;
  examTitle: string;
  amount: number;
  onPaymentInitialized?: () => void;
}

const ExamPaymentModal = ({
  open,
  onOpenChange,
  examId,
  examTitle,
  amount,
  onPaymentInitialized
}: ExamPaymentModalProps) => {
  const [selectedGateway, setSelectedGateway] = useState<'PAYSTACK' | 'FLUTTERWAVE'>('PAYSTACK');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await initializePayment(examId, selectedGateway);
      
      toast.success('Redirecting to payment gateway...');
      
      if (onPaymentInitialized) {
        onPaymentInitialized();
      }
      
      // Redirect to payment gateway
      window.location.href = response.authorization_url;
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exam Fee Payment Required</DialogTitle>
          <DialogDescription>
            Complete payment to download your exam pass for {examTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to pay the exam fee before downloading your exam pass.
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
            <RadioGroup value={selectedGateway} onValueChange={(value) => setSelectedGateway(value as 'PAYSTACK' | 'FLUTTERWAVE')}>
              <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="PAYSTACK" id="paystack" />
                <Label htmlFor="paystack" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="font-medium">Paystack</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pay with card, bank transfer, or USSD</p>
                </Label>
              </div>

              <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="FLUTTERWAVE" id="flutterwave" />
                <Label htmlFor="flutterwave" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="font-medium">Flutterwave</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pay with card, bank, or mobile money</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamPaymentModal;
