import { ExamPaymentHistory } from '@/services/examPaymentHistoryApiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ExamPaymentCardProps {
  payment: ExamPaymentHistory;
  onDownloadReceipt: (payment: ExamPaymentHistory) => void;
}

export const ExamPaymentCard = ({ payment, onDownloadReceipt }: ExamPaymentCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Paid</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header with exam title and status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{payment.exam.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              <Badge variant="outline" className="text-xs">{payment.exam.course.code}</Badge>
            </p>
          </div>
          {getStatusBadge(payment.paymentStatus)}
        </div>

        {/* Payment details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{payment.paymentDate ? format(new Date(payment.paymentDate), 'PP') : 'N/A'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>{payment.paymentChannel}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-semibold text-foreground text-lg">₦{payment.amountPaid.toLocaleString()}</span>
          </div>

          <div className="text-xs text-muted-foreground font-mono truncate">
            Ref: {payment.paymentReference}
          </div>
        </div>

        {/* Action button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onDownloadReceipt(payment)}
          disabled={payment.paymentStatus !== 'PAID'}
        >
          <FileText className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
      </CardContent>
    </Card>
  );
};
