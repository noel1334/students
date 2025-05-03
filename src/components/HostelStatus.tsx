
import React, { useState } from 'react';
import { Home, MapPin, Calendar, Users, Download, Info, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ReceiptDownloader from './ReceiptDownloader';
import HostelReceipt from './HostelReceipt';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const HostelStatus = () => {
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState("2023/2024");
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const isMobile = useIsMobile();
  
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
    academicYear: selectedSession,
    receiptNumber: hostelData.payment.receiptNumber
  };

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
  };

  const handlePayment = () => {
    // In a real app, this would process the payment via the selected gateway
    toast.success(`Processing payment via ${paymentMethod}`, {
      description: "You'll be redirected to complete your payment."
    });
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success("Payment successful!", {
        description: "Your hostel payment has been confirmed."
      });
      setShowPaymentDialog(false);
    }, 2000);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full flex gap-2 items-center"
                  onClick={() => setShowReceiptDialog(true)}
                >
                  <Download size={14} /> View/Download Receipt
                </Button>
                <Button 
                  className="w-full flex gap-2 items-center"
                  onClick={() => setShowPaymentDialog(true)}
                >
                  <CreditCard size={14} /> Make Payment
                </Button>
              </div>
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
      
      {/* Receipt Dialog - Improved for mobile */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw] p-3 sm:p-6" : "sm:max-w-3xl"}>
          <DialogHeader className="space-y-2">
            <DialogTitle>Hostel Payment Receipt</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">Academic Year:</span>
                <Select
                  value={selectedSession}
                  onValueChange={setSelectedSession}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select Session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023/2024">2023/2024</SelectItem>
                    <SelectItem value="2022/2023">2022/2023</SelectItem>
                    <SelectItem value="2021/2022">2021/2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className={`border rounded-lg overflow-hidden ${isMobile ? "max-h-[60vh] overflow-y-auto" : ""}`}>
            <HostelReceipt {...receiptData} />
          </div>
          
          <div className="flex justify-end mt-4">
            <ReceiptDownloader receiptData={receiptData} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw] p-3 sm:p-6" : "sm:max-w-md"}>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to complete your hostel payment
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{hostelData.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {hostelData.room}, {hostelData.block}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Academic Year: {selectedSession}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm">₦{hostelData.payment.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <RadioGroup defaultValue="paystack" className="grid grid-cols-1 gap-3">
              <div 
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors ${paymentMethod === "paystack" ? "border-primary bg-primary/5" : ""}`}
                onClick={() => handlePaymentMethodSelect("paystack")}
              >
                <RadioGroupItem value="paystack" id="paystack" checked={paymentMethod === "paystack"} />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="paystack" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Paystack</span>
                  </label>
                  <img src="https://paystack.com/assets/img/logo/paystack-logo-vector.svg" alt="Paystack" className="h-6" />
                </div>
              </div>
              <div 
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors ${paymentMethod === "stripe" ? "border-primary bg-primary/5" : ""}`}
                onClick={() => handlePaymentMethodSelect("stripe")}
              >
                <RadioGroupItem value="stripe" id="stripe" checked={paymentMethod === "stripe"} />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="stripe" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Stripe</span>
                  </label>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                </div>
              </div>
              <div 
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors ${paymentMethod === "flutterwave" ? "border-primary bg-primary/5" : ""}`}
                onClick={() => handlePaymentMethodSelect("flutterwave")}
              >
                <RadioGroupItem value="flutterwave" id="flutterwave" checked={paymentMethod === "flutterwave"} />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="flutterwave" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Flutterwave</span>
                  </label>
                  <img src="https://cdn.filestackcontent.com/OITnhSPCSzOuiw9ohCBG" alt="Flutterwave" className="h-6" />
                </div>
              </div>
            </RadioGroup>
            
            <Button 
              onClick={handlePayment} 
              className="w-full mt-2"
            >
              Proceed with Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostelStatus;
