
import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/DashboardHeader';
import PaymentStatus from '@/components/PaymentStatus';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CreditCard, Download, AlertCircle } from 'lucide-react';

const Payments = () => {
  const [selectedSemester, setSelectedSemester] = useState('1st');
  const [selectedSession, setSelectedSession] = useState('2023/2024');
  const receiptRef = useRef(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Payment_Receipt_${selectedSession}_${selectedSemester}`,
  });

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold mb-6">My Payments</h1>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-40">
                  <label className="block text-sm text-gray-600 mb-1">Semester</label>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Semester</SelectItem>
                      <SelectItem value="2nd">2nd Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-40">
                  <label className="block text-sm text-gray-600 mb-1">Session</label>
                  <Select
                    value={selectedSession}
                    onValueChange={setSelectedSession}
                  >
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
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download Receipt
              </Button>
            </div>
            
            <div ref={receiptRef} className="p-4 print:p-10">
              <div className="print:block print:mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">University Name</h2>
                  <p className="text-gray-500">Payment Receipt</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:mb-8">
                  <div>
                    <p className="text-gray-600"><span className="font-medium">Student ID:</span> STD123456</p>
                    <p className="text-gray-600"><span className="font-medium">Name:</span> John Doe</p>
                    <p className="text-gray-600"><span className="font-medium">Department:</span> Computer Science</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><span className="font-medium">Session:</span> {selectedSession}</p>
                    <p className="text-gray-600"><span className="font-medium">Semester:</span> {selectedSemester}</p>
                    <p className="text-gray-600"><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <PaymentStatus />
              
              <div className="mt-8 text-center print:mt-12">
                <p className="text-sm text-gray-500">This is an official receipt. Thank you for your payment.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Make Payment</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Current Fees Due</h3>
                  <p className="text-xl font-bold">₦120,000</p>
                  <p className="text-sm text-gray-500">For {selectedSession} {selectedSemester} Semester</p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <CreditCard className="mr-2" size={18} />
                      Make Payment
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Select Payment Method</AlertDialogTitle>
                      <AlertDialogDescription>
                        Choose your preferred payment method to continue.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                      <Button variant="outline" className="h-24 flex flex-col justify-center">
                        <div className="text-lg font-semibold mb-1">PayStack</div>
                        <div className="text-xs text-gray-500">Credit/Debit Card</div>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col justify-center">
                        <div className="text-lg font-semibold mb-1">Stripe</div>
                        <div className="text-xs text-gray-500">International Payments</div>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col justify-center">
                        <div className="text-lg font-semibold mb-1">Flutterwave</div>
                        <div className="text-xs text-gray-500">Multiple Payment Options</div>
                      </Button>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <div className="flex items-center gap-2 p-3 border border-yellow-300 bg-yellow-50 rounded-md">
                <AlertCircle size={18} className="text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Payment deadline: June 30, 2023. Late payments incur a 5% penalty fee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
