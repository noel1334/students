
import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import { CreditCard, Download, AlertCircle, Calendar, ChevronDown } from 'lucide-react';

const Payments = () => {
  const [selectedSemester, setSelectedSemester] = useState('1st');
  const [selectedSession, setSelectedSession] = useState('2023/2024');
  const receiptRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Payment_Receipt_${selectedSession}_${selectedSemester}`,
  });

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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
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

            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard size={18} className="text-primary" /> 
                  Current Fees
                </CardTitle>
                <CardDescription>Outstanding balance for {selectedSession}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 p-4 rounded-lg mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-700 font-medium">Current Balance</p>
                    <p className="text-xl font-bold text-gray-900">₦120,000</p>
                  </div>
                  <p className="text-sm text-gray-500">{selectedSemester} Semester, {selectedSession} Session</p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full gap-2 font-medium">
                      <CreditCard size={18} />
                      Make Payment
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Select Payment Method</AlertDialogTitle>
                      <AlertDialogDescription>
                        Choose your preferred payment method to continue.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                      <Button variant="outline" className="h-24 flex flex-col justify-center hover:border-primary hover:bg-primary/5">
                        <div className="text-lg font-semibold mb-1">PayStack</div>
                        <div className="text-xs text-gray-500">Card Payment</div>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col justify-center hover:border-primary hover:bg-primary/5">
                        <div className="text-lg font-semibold mb-1">Stripe</div>
                        <div className="text-xs text-gray-500">International</div>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col justify-center hover:border-primary hover:bg-primary/5">
                        <div className="text-lg font-semibold mb-1">Flutterwave</div>
                        <div className="text-xs text-gray-500">Multiple Options</div>
                      </Button>
                    </div>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center gap-2 p-3 border border-yellow-300 bg-yellow-50 rounded-md w-full">
                  <AlertCircle size={18} className="text-yellow-600 shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Payment deadline: June 30, 2023. Late payments incur a 5% penalty fee.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
