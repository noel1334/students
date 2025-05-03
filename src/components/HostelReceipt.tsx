
import React, { forwardRef } from 'react';
import { Card } from '@/components/ui/card';

interface HostelReceiptProps {
  studentName: string;
  studentId: string;
  blockName: string;
  roomNumber: string;
  amount: number;
  paymentDate: string;
  paymentId: string;
  academicYear: string;
  receiptNumber: string;
}

const HostelReceipt = forwardRef<HTMLDivElement, HostelReceiptProps>(
  ({
    studentName,
    studentId,
    blockName,
    roomNumber,
    amount,
    paymentDate,
    paymentId,
    academicYear,
    receiptNumber,
  }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white max-w-2xl mx-auto shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue">University Hostel Service</h1>
            <p className="text-gray-600 text-sm">Student Accommodation Receipt</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Receipt #: {receiptNumber}</p>
            <p className="text-sm text-gray-600">Date: {paymentDate}</p>
          </div>
        </div>
        
        {/* Border */}
        <div className="border-t-2 border-blue mb-6"></div>
        
        {/* Content */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm text-gray-600 mb-1">Student Information</h2>
            <p className="font-medium">{studentName}</p>
            <p className="text-sm text-gray-600">ID: {studentId}</p>
            <p className="text-sm text-gray-600">Academic Year: {academicYear}</p>
          </div>
          <div>
            <h2 className="text-sm text-gray-600 mb-1">Accommodation Details</h2>
            <p className="font-medium">{blockName}</p>
            <p className="text-sm text-gray-600">Room: {roomNumber}</p>
          </div>
        </div>
        
        {/* Payment Details */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b text-left text-sm">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3">Hostel Accommodation Fee - {blockName}</td>
              <td className="py-3 text-right">₦{amount.toLocaleString()}</td>
            </tr>
          </tbody>
          <tfoot className="border-t font-medium">
            <tr>
              <td className="py-3">Total Paid</td>
              <td className="py-3 text-right">₦{amount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        
        {/* Footer */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <div>
              <p>Payment Reference: {paymentId}</p>
              <p>Payment Method: Online Payment</p>
            </div>
            <div className="text-right">
              <p>Status: <span className="text-green-600 font-medium">PAID</span></p>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>This is an electronically generated receipt and does not require a signature.</p>
            <p>For any inquiries, please contact the Hostel Management Office.</p>
          </div>
        </div>
      </div>
    );
  }
);

HostelReceipt.displayName = "HostelReceipt";

export default HostelReceipt;
