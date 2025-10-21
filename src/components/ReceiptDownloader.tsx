
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import HostelReceipt from './HostelReceipt';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "sonner";

interface ReceiptDownloaderProps {
  receiptData: {
    studentName: string;
    studentId: string;
    blockName: string;
    roomNumber: string;
    amount: number;
    paymentDate: string;
    paymentId: string;
    academicYear: string;
    receiptNumber: string;
  };
}

const ReceiptDownloader = ({ receiptData }: ReceiptDownloaderProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Hostel_Receipt_${receiptData.receiptNumber}`,
    onAfterPrint: () => {
      toast.success('Receipt downloaded successfully!');
    },
    onPrintError: () => {
      toast.error('Failed to download receipt. Please try again.');
    },
  });

  return (
    <div>
      <Button 
        onClick={handlePrint}
        variant="outline" 
        className="flex items-center gap-2"
        size={isMobile ? "sm" : "default"}
      >
        <Download className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        Download Receipt
      </Button>
      
      <div className="hidden">
        <div ref={receiptRef}>
          <HostelReceipt {...receiptData} />
        </div>
      </div>
    </div>
  );
};

export default ReceiptDownloader;
