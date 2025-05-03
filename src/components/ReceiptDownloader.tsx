
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import HostelReceipt from './HostelReceipt';

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

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Hostel_Receipt_${receiptData.receiptNumber}`,
    onAfterPrint: () => console.log('Receipt printed/downloaded successfully!'),
  });

  return (
    <div>
      <Button 
        onClick={handlePrint}
        variant="outline" 
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Receipt
      </Button>
      
      <div className="hidden">
        <HostelReceipt ref={receiptRef} {...receiptData} />
      </div>
    </div>
  );
};

export default ReceiptDownloader;
