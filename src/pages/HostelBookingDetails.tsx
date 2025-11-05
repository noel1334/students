import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, Home, Calendar, CreditCard, Receipt, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getHostelBookingById, type BookingDetail } from '@/services/hostelApiService';
import { useAuth } from '@/contexts/AuthContext';
import { useReactToPrint } from 'react-to-print';

const HostelBookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetail | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        toast.error('Invalid booking ID');
        navigate('/hostel');
        return;
      }

      try {
        setLoading(true);
        const response = await getHostelBookingById(parseInt(bookingId));
        setBooking(response.data.booking);
      } catch (error: any) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to load booking details');
        navigate('/hostel');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Hostel_Booking_${booking?.id || bookingId}`,
    onAfterPrint: () => {
      toast.success('Booking details downloaded successfully!');
    },
    onPrintError: () => {
      toast.error('Failed to download. Please try again.');
    },
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PAID: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      PARTIAL: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
      FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    };
    return colors[status] || colors.PENDING;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Booking Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The requested booking could not be found.
          </p>
          <Button onClick={() => navigate('/hostel')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hostel
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Not printed */}
      <div className="bg-card border-b border-border print:hidden">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/hostel')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Hostel
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div ref={printRef} className="bg-card print:bg-white">
          {/* Receipt Header */}
          <div className="p-6 md:p-8 border border-border print:border-gray-300 rounded-lg print:rounded-none">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
                University Hostel Service
              </h1>
              <p className="text-sm text-muted-foreground">Student Accommodation Receipt</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-6 border-b border-border print:border-gray-300">
              <div>
                <p className="text-sm text-muted-foreground">Receipt #</p>
                <p className="font-mono font-semibold">UMS-HB-{booking.id}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(booking.createdAt)}</p>
              </div>
            </div>

            {/* Student & Accommodation Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Student Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{booking.student.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>
                    <p className="font-mono">{booking.student.regNo}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Academic Year:</span>
                    <p className="font-medium">{booking.season.name}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Accommodation Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Hostel:</span>
                    <p className="font-medium">{booking.hostel.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Room:</span>
                    <p className="font-medium">{booking.room?.roomNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacity:</span>
                    <p className="font-medium">{booking.room?.capacity || 'N/A'} beds</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Period */}
            <div className="mb-6 p-4 bg-muted/50 print:bg-gray-50 rounded-md">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Check-in Date</p>
                  <p className="font-semibold">{formatDate(booking.checkInDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Check-out Date</p>
                  <p className="font-semibold">{formatDate(booking.checkOutDate)}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Fee Breakdown */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Fee Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Description</span>
                  <span className="text-muted-foreground">Amount</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostel Accommodation Fee - {booking.hostel.name}</span>
                  <span className="font-medium">₦{booking.amountDue?.toLocaleString() || '0'}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₦{booking.amountDue?.toLocaleString() || '0'}</span>
                </div>
                
                <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                  <span>Total Paid</span>
                  <span>₦{booking.amountPaid.toLocaleString()}</span>
                </div>
                
                {booking.amountDue && booking.amountPaid < booking.amountDue && (
                  <div className="flex justify-between text-orange-600 dark:text-orange-400 font-semibold">
                    <span>Balance Due</span>
                    <span>₦{(booking.amountDue - booking.amountPaid).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Payment Transactions */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Payment Transactions ({booking.payments?.length || 0})
              </h3>
              
              {booking.payments && booking.payments.length > 0 ? (
                <div className="space-y-3">
                  {booking.payments.map((payment, index) => (
                    <Card key={payment.id} className="p-4 print:border print:border-gray-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Transaction #{index + 1}
                            </Badge>
                            <Badge className={getStatusColor(payment.paymentStatus)}>
                              {payment.paymentStatus}
                            </Badge>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Reference:</span>
                              <p className="font-mono text-xs">{payment.reference}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Channel:</span>
                              <p className="font-medium">{payment.channel}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date:</span>
                              <p>{formatDateTime(payment.paymentDate)}</p>
                            </div>
                            {payment.transactionId && (
                              <div>
                                <span className="text-muted-foreground">Transaction ID:</span>
                                <p className="font-mono text-xs">{payment.transactionId}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            ₦{payment.amountPaid.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No payment transactions recorded
                </p>
              )}
            </div>

            <Separator className="my-6" />

            {/* Booking Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-muted/50 print:bg-gray-50 rounded-md">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Booking Status</p>
                <Badge className={getStatusColor(booking.paymentStatus)}>
                  {booking.paymentStatus}
                </Badge>
              </div>
              {booking.paymentDeadline && (
                <div className="text-left sm:text-right">
                  <p className="text-sm text-muted-foreground mb-1">Payment Deadline</p>
                  <p className="font-medium">{formatDate(booking.paymentDeadline)}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-border print:border-gray-300">
              <p className="text-xs text-muted-foreground">
                This is an electronically generated receipt and does not require a signature.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                For any inquiries, please contact the Hostel Management Office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelBookingDetails;
