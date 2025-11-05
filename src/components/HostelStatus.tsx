import React, { useState, useEffect } from 'react';
import { Home, MapPin, Calendar, Users, Download, Info, CreditCard, Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getMyHostelBookings, fetchMyRoommates, type BookingDetail, type RoommateDetail } from '@/services/hostelApiService';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

const HostelStatus = () => {
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState("2023/2024");
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [roommates, setRoommates] = useState<RoommateDetail[]>([]);
  const [loadingRoommates, setLoadingRoommates] = useState(false);

  // Fetch the student's hostel booking
  useEffect(() => {
    const fetchBooking = async () => {
      if (!user?.currentSeasonId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getMyHostelBookings(1, 1, 'PAID'); // Fetch only paid bookings
        
        if (response.data.bookings && response.data.bookings.length > 0) {
          const currentBooking = response.data.bookings[0];
          setBooking(currentBooking);
          
          // Fetch roommates if we have a booking
          if (currentBooking && user.currentSeasonId) {
            fetchRoommatesData(parseInt(user.currentSeasonId));
          }
        } else {
          setBooking(null);
        }
      } catch (error: any) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load hostel booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [user?.currentSeasonId]);

  const fetchRoommatesData = async (seasonId: number) => {
    try {
      setLoadingRoommates(true);
      const roommatesData = await fetchMyRoommates(seasonId);
      setRoommates(roommatesData);
    } catch (error) {
      console.error('Error fetching roommates:', error);
      // Don't show error toast for roommates, it's not critical
    } finally {
      setLoadingRoommates(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <Card className="p-8 text-center">
        <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Active Hostel Booking</h3>
        <p className="text-muted-foreground mb-4">
          You don't have an active hostel booking for the current academic session.
        </p>
        <p className="text-sm text-muted-foreground">
          Please navigate to the "Book Accommodation" tab to make a booking.
        </p>
      </Card>
    );
  }

  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get the latest payment
  const latestPayment = booking.payments && booking.payments.length > 0 
    ? booking.payments[booking.payments.length - 1] 
    : null;

  // Receipt data for downloaded receipt
  const receiptData = {
    studentName: user?.name || 'Student',
    studentId: user?.regNo || 'N/A',
    blockName: booking.hostel.name,
    roomNumber: booking.room?.roomNumber || 'N/A',
    amount: booking.amountPaid,
    paymentDate: latestPayment ? formatDate(latestPayment.paymentDate) : 'N/A',
    paymentId: latestPayment?.reference || 'N/A',
    academicYear: booking.season.name,
    receiptNumber: latestPayment?.reference || 'N/A'
  };

  const isPaid = booking.paymentStatus === 'PAID' || booking.paymentStatus === 'COMPLETED';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Hostel Information</h2>
        <div className={`px-2 py-1 text-xs rounded-full ${
          isPaid 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
        }`}>
          {isPaid ? 'Active' : booking.paymentStatus}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex gap-3 items-start">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Home className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-medium">{booking.hostel.name}</h3>
              <p className="text-sm text-muted-foreground">
                Room {booking.room?.roomNumber || 'N/A'}
              </p>
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
                <span className="text-sm font-medium">{formatDate(booking.checkInDate)}</span>
              </div>
            </div>
            <div className="p-3 border border-border rounded-md">
              <span className="text-xs text-muted-foreground">Check-out Date</span>
              <div className="flex items-center gap-1 mt-1">
                <Calendar size={14} />
                <span className="text-sm font-medium">{formatDate(booking.checkOutDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Payment Information</h3>
            </div>
            <div className="border border-border rounded-md p-3">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Amount Due:</span>
                <span className="font-medium">₦{booking.amountDue?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Amount Paid:</span>
                <span className="font-medium">₦{booking.amountPaid.toLocaleString()}</span>
              </div>
              {latestPayment && (
                <>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Payment Date:</span>
                    <span>{formatDate(latestPayment.paymentDate)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Receipt Number:</span>
                    <span className="text-xs">{latestPayment.reference}</span>
                  </div>
                </>
              )}
              {isPaid && (
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full flex gap-2 items-center"
                    onClick={() => setShowReceiptDialog(true)}
                  >
                    <Download size={14} /> View/Download Receipt
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <Users size={16} />
              <span>Roommates</span>
            </h3>
            {loadingRoommates ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading roommates...</span>
              </div>
            ) : roommates.length > 0 ? (
              <div className="space-y-2">
                {roommates.map((roommate) => (
                  <div key={roommate.id} className="flex items-center gap-2">
                    <div className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                      {roommate.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium">{roommate.name}</span>
                      <p className="text-xs text-muted-foreground">{roommate.regNo}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No roommates assigned yet</p>
            )}
          </div>
          
          <div className="mt-6 p-3 border border-border bg-muted/50 rounded-md flex gap-2">
            <div className="flex-shrink-0">
              <Info size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              If you need to request maintenance or have any issues with your accommodation, please submit a request through the student portal or contact the hostel management office.
            </p>
          </div>
        </div>
      </div>
      
      {/* Receipt Dialog */}
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
                    <SelectItem value={booking.season.name}>{booking.season.name}</SelectItem>
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
    </div>
  );
};

export default HostelStatus;
