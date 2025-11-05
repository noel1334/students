import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, Calendar, Users, Download, Info, CreditCard, Loader2, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HostelStatus = () => {
  const navigate = useNavigate();
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [selectedSession, setSelectedSession] = useState("2023/2024");
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Active booking state
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<BookingDetail | null>(null);
  const [roommates, setRoommates] = useState<RoommateDetail[]>([]);
  const [loadingRoommates, setLoadingRoommates] = useState(false);

  // Booking history state
  const [bookingHistory, setBookingHistory] = useState<BookingDetail[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<string>('current');
  
  const itemsPerPage = 5;

  // Fetch the student's active hostel booking (current session, paid status)
  useEffect(() => {
    const fetchActiveBooking = async () => {
      if (!user?.currentSeasonId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getMyHostelBookings(1, 1, 'PAID');
        
        if (response.data.bookings && response.data.bookings.length > 0) {
          const currentBooking = response.data.bookings[0];
          setActiveBooking(currentBooking);
          
          // Fetch roommates if we have a booking
          if (currentBooking && user.currentSeasonId) {
            fetchRoommatesData(parseInt(user.currentSeasonId));
          }
        } else {
          setActiveBooking(null);
        }
      } catch (error: any) {
        console.error('Error fetching active booking:', error);
        toast.error('Failed to load current hostel booking');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBooking();
  }, [user?.currentSeasonId]);

  // Fetch booking history with pagination and filters
  useEffect(() => {
    if (activeTab !== 'history') return;

    const fetchBookingHistory = async () => {
      try {
        setHistoryLoading(true);
        const filterStatus = statusFilter === 'ALL' ? undefined : statusFilter;
        const response = await getMyHostelBookings(currentPage, itemsPerPage, filterStatus);
        
        setBookingHistory(response.data.bookings);
        setTotalPages(response.data.totalPages);
      } catch (error: any) {
        console.error('Error fetching booking history:', error);
        toast.error('Failed to load booking history');
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchBookingHistory();
  }, [activeTab, currentPage, statusFilter]);

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

  const openReceiptDialog = (booking: BookingDetail) => {
    setSelectedBooking(booking);
    setSelectedSession(booking.season.name);
    setShowReceiptDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      PAID: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      PARTIAL: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
      FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    };
    return statusColors[status] || statusColors.PENDING;
  };

  const renderBookingCard = (booking: BookingDetail, isActive: boolean = false) => {
    const formatDate = (dateString: string | null) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const latestPayment = booking.payments && booking.payments.length > 0 
      ? booking.payments[booking.payments.length - 1] 
      : null;

    const isPaid = booking.paymentStatus === 'PAID' || booking.paymentStatus === 'COMPLETED';

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

    return (
      <Card className="p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{booking.hostel.name}</h3>
            <p className="text-sm text-muted-foreground">
              Room {booking.room?.roomNumber || 'N/A'} • {booking.season.name}
            </p>
          </div>
          <Badge className={getStatusBadge(booking.paymentStatus)}>
            {booking.paymentStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Check-in:</span>
            <p className="font-medium">{formatDate(booking.checkInDate)}</p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Check-out:</span>
            <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Amount Due:</span>
            <p className="font-medium">₦{booking.amountDue?.toLocaleString() || '0'}</p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Amount Paid:</span>
            <p className="font-medium">₦{booking.amountPaid.toLocaleString()}</p>
          </div>
        </div>

        {isPaid && latestPayment && (
          <div className="pt-3 border-t border-border">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-muted-foreground">Payment Date:</span>
              <span>{formatDate(latestPayment.paymentDate)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-muted-foreground">Receipt No:</span>
              <span className="text-xs font-mono">{latestPayment.reference}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full flex gap-2 items-center"
              onClick={() => navigate(`/hostel/booking/${booking.id}`)}
            >
              <Eye size={14} /> View Details
            </Button>
          </div>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Generate receipt data for the selected booking
  const getReceiptData = (booking: BookingDetail | null) => {
    if (!booking) return null;

    const latestPayment = booking.payments && booking.payments.length > 0 
      ? booking.payments[booking.payments.length - 1] 
      : null;

    return {
      studentName: user?.name || 'Student',
      studentId: user?.regNo || 'N/A',
      blockName: booking.hostel.name,
      roomNumber: booking.room?.roomNumber || 'N/A',
      amount: booking.amountPaid,
      paymentDate: latestPayment ? new Date(latestPayment.paymentDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'N/A',
      paymentId: latestPayment?.reference || 'N/A',
      academicYear: booking.season.name,
      receiptNumber: latestPayment?.reference || 'N/A'
    };
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="current">Current Booking</TabsTrigger>
          <TabsTrigger value="history">Booking History</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {!activeBooking ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {renderBookingCard(activeBooking, true)}
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
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Filter size={18} />
              Filter Bookings
            </h3>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PARTIAL">Partial Payment</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookingHistory.length === 0 ? (
            <Card className="p-8 text-center">
              <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Booking History</h3>
              <p className="text-muted-foreground">
                You haven't made any hostel bookings yet.
              </p>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {bookingHistory.map((booking) => (
                  <div key={booking.id}>
                    {renderBookingCard(booking)}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Receipt Dialog */}
      {selectedBooking && (
        <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
          <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw] p-3 sm:p-6" : "sm:max-w-3xl"}>
            <DialogHeader className="space-y-2">
              <DialogTitle>Hostel Payment Receipt</DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">Academic Year:</span>
                  <span className="text-sm font-medium">{selectedBooking.season.name}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className={`border rounded-lg overflow-hidden ${isMobile ? "max-h-[60vh] overflow-y-auto" : ""}`}>
              <HostelReceipt {...getReceiptData(selectedBooking)!} />
            </div>
            
            <div className="flex justify-end mt-4">
              <ReceiptDownloader receiptData={getReceiptData(selectedBooking)!} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HostelStatus;
