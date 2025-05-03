
import React, { useState } from 'react';
import { Home, MapPin, Calendar, Users, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReceiptDownloader from './ReceiptDownloader';

const HostelStatus = () => {
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  
  // This would come from an API in a real application
  const hostelData = {
    name: "Diamond Hall",
    room: "Room 234",
    block: "Block C",
    checkIn: "September 10, 2023",
    checkOut: "July 20, 2024",
    status: "active",
    roommates: [
      "Jane Smith",
      "Sarah Johnson"
    ],
    features: [
      "Wi-Fi",
      "Study Room",
      "Kitchen Access",
      "Laundry"
    ],
    payment: {
      amount: 95000,
      date: "August 15, 2023",
      id: "PAY-2023081501",
      academicYear: "2023/2024",
      receiptNumber: "REC-2023081501"
    }
  };

  // Receipt data for downloaded receipt
  const receiptData = {
    studentName: "John Doe", // Would come from user authentication
    studentId: "STU-2023-001",
    blockName: hostelData.block,
    roomNumber: hostelData.room,
    amount: hostelData.payment.amount,
    paymentDate: hostelData.payment.date,
    paymentId: hostelData.payment.id,
    academicYear: hostelData.payment.academicYear,
    receiptNumber: hostelData.payment.receiptNumber
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Hostel Information</h2>
        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          Active
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex gap-3 items-start">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Home className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-medium">{hostelData.name}</h3>
              <p className="text-sm text-muted-foreground">{hostelData.room}, {hostelData.block}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin size={14} className="mr-1" />
                <span>Main Campus</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-3 border border-border rounded-md">
              <span className="text-xs text-muted-foreground">Check-in Date</span>
              <div className="flex items-center gap-1 mt-1">
                <Calendar size={14} />
                <span className="text-sm font-medium">{hostelData.checkIn}</span>
              </div>
            </div>
            <div className="p-3 border border-border rounded-md">
              <span className="text-xs text-muted-foreground">Check-out Date</span>
              <div className="flex items-center gap-1 mt-1">
                <Calendar size={14} />
                <span className="text-sm font-medium">{hostelData.checkOut}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Payment Information</h3>
            </div>
            <div className="border border-border rounded-md p-3">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Amount Paid:</span>
                <span className="font-medium">₦{hostelData.payment.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Payment Date:</span>
                <span>{hostelData.payment.date}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-sm text-muted-foreground">Receipt Number:</span>
                <span>{hostelData.payment.receiptNumber}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full flex gap-2 items-center"
                onClick={() => setShowReceiptDialog(true)}
              >
                <Download size={14} /> View/Download Receipt
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <Users size={16} />
              <span>Roommates</span>
            </h3>
            <div className="space-y-2">
              {hostelData.roommates.map((roommate, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center">
                    {roommate.charAt(0)}
                  </div>
                  <span className="text-sm">{roommate}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {hostelData.features.map((feature, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-3 border border-blue-200 bg-blue-50 rounded-md flex gap-2">
            <div className="flex-shrink-0">
              <Info size={16} className="text-blue-600" />
            </div>
            <p className="text-xs text-blue-800">
              If you need to request maintenance or have any issues with your accommodation, please submit a request through the student portal or contact the hostel management office.
            </p>
          </div>
        </div>
      </div>
      
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Hostel Payment Receipt</DialogTitle>
          </DialogHeader>
          
          <div className="border rounded-lg overflow-hidden">
            <HostelReceipt {...receiptData} />
          </div>
          
          <div className="flex justify-end mt-4">
            <ReceiptDownloader receiptData={receiptData} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostelStatus;
