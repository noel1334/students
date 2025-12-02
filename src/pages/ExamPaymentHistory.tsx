// src/pages/ExamPaymentHistory.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Receipt, Filter, CreditCard, Calendar, RefreshCw, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getMyExamPaymentHistory, ExamPaymentHistory, PaymentHistoryResponse } from '@/services/examPaymentHistoryApiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this is installed if not already (npm install jspdf-autotable)

const ExamPaymentHistoryPage = () => {
  const [payments, setPayments] = useState<ExamPaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const filters: { status?: string; channel?: string } = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (channelFilter !== 'all') filters.channel = channelFilter;

      const response: PaymentHistoryResponse = await getMyExamPaymentHistory(currentPage, 10, filters);
      setPayments(response.items || []);
      setTotalPages(response.totalPages || 0);
      setTotalItems(response.totalItems || 0);
    } catch (error: any) {
      console.error('Failed to fetch payment history:', error);
      toast.error('Failed to load payment history', {
        description: error.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter, channelFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-0.5">Paid</Badge>; // Added text-xs, px, py
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-0.5">Pending</Badge>; // Added text-xs, px, py
      case 'FAILED':
        return <Badge variant="destructive" className="text-xs px-2 py-0.5">Failed</Badge>; // Added text-xs, px, py
      default:
        return <Badge variant="secondary" className="text-xs px-2 py-0.5">{status}</Badge>; // Added text-xs, px, py
    }
  };

  const getChannelIcon = (channel: string) => {
    // Smaller icon for mobile
    return <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />;
  };

  const handleDownloadReceipt = (payment: ExamPaymentHistory) => {
    if (payment.paymentStatus !== 'PAID') {
      toast.error('Receipt unavailable', { description: 'Only paid transactions have receipts.' });
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(26, 74, 166);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Exam Fee Payment', 105, 30, { align: 'center' });

    // Receipt details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    const details = [
      ['Receipt No:', payment.paymentReference],
      ['Transaction ID:', payment.transactionId || 'N/A'],
      ['Payment Date:', payment.paymentDate ? format(new Date(payment.paymentDate), 'PPP p') : 'N/A'],
      ['Payment Channel:', payment.paymentChannel],
      [''],
      ['Student Name:', payment.student.name],
      ['Registration No:', payment.student.regNo],
      [''],
      ['Exam:', payment.exam.title],
      ['Course Code:', payment.exam.course.code],
      [''],
      ['Amount Paid:', `₦${payment.amountPaid.toLocaleString()}`],
      ['Status:', 'PAID'],
    ];

    let yPos = 55;
    details.forEach(([label, value]) => {
      if (label === '') {
        yPos += 5;
        return;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value || '', 80, yPos);
      yPos += 8;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('This is a computer-generated receipt. No signature required.', 105, 280, { align: 'center' });
    doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, 105, 285, { align: 'center' });

    doc.save(`receipt-${payment.paymentReference}.pdf`);
    toast.success('Receipt downloaded successfully');
  };

  const handleExportAll = () => {
    if (payments.length === 0) {
      toast.error('No payments to export');
      return;
    }

    const doc = new jsPDF('landscape');
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Exam Payment History', 14, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [['Date', 'Reference', 'Exam', 'Course', 'Amount', 'Channel', 'Status']],
      body: payments.map(p => [
        p.paymentDate ? format(new Date(p.paymentDate), 'PP') : 'N/A',
        p.paymentReference,
        p.exam.title,
        p.exam.course.code,
        `₦${p.amountPaid.toLocaleString()}`,
        p.paymentChannel,
        p.paymentStatus,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [26, 74, 166] },
    });

    doc.save('exam-payment-history.pdf');
    toast.success('Payment history exported');
  };

  return (
    // Outer-most div for the page content, ensuring it takes full width
    <div className="w-full p-4 md:p-6 space-y-6"> 
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2"> {/* Smaller h1 on mobile */}
            <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> {/* Smaller icon on mobile */}
            Exam Payment History
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">View all your exam fee payments</p> {/* Smaller text on mobile */}
        </div>
        {/* Buttons stack on mobile, go side-by-side on sm screens and up */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto"> 
          <Button variant="outline" size="sm" onClick={fetchPayments} disabled={loading} className="w-full sm:w-auto"> {/* Full width on mobile */}
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportAll} disabled={payments.length === 0} className="w-full sm:w-auto"> {/* Full width on mobile */}
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3 px-4 sm:px-6"> 
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4"> 
          {/* Filters now stack on mobile (w-full) and go side-by-side on sm screens (sm:w-auto) */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <div className="w-full sm:w-auto flex-1"> {/* flex-1 allows it to grow on larger screens */}
              <label className="text-sm font-medium text-muted-foreground block mb-1">Status</label>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full"> {/* Ensure trigger takes full width of its parent */}
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto flex-1"> {/* flex-1 allows it to grow on larger screens */}
              <label className="text-sm font-medium text-muted-foreground block mb-1">Channel</label>
              <Select value={channelFilter} onValueChange={(value) => { setChannelFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full"> {/* Ensure trigger takes full width of its parent */}
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="PAYSTACK">Paystack</SelectItem>
                  <SelectItem value="FLUTTERWAVE">Flutterwave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Table */}
      <Card className="overflow-hidden"> 
        <CardHeader className="px-4 sm:px-6"> 
          <CardTitle className="text-lg sm:text-xl">Payment Records</CardTitle> {/* Adjust title size */}
          <CardDescription className="text-sm sm:text-base"> {/* Adjust description size */}
            {totalItems > 0 ? `Showing ${payments.length} of ${totalItems} payments` : 'No payments found'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0"> 
          {loading ? (
            <div className="flex items-center justify-center py-12 px-4 sm:px-6"> 
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 px-4 sm:px-6"> 
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No payments found</h3>
              <p className="text-muted-foreground mt-1">You haven't made any exam fee payments yet.</p>
            </div>
          ) : (
            <>
              {/* This div handles the horizontal scrolling for the table */}
              <div className="overflow-x-auto"> 
                {/* min-w-[700px] to ensure horizontal scrolling is possible, 
                    but not so wide it causes excessive empty space on wider mobile views.
                    Consider `min-w-[max-content]` for very specific cases, but fixed pixel is often safer. */}
                <Table className="min-w-[700px]"> 
                  <TableHeader>
                    <TableRow>
                      {/* Smaller padding and font size for TableHead cells on mobile */}
                      <TableHead className="px-2 py-2 text-xs sm:px-4 sm:py-3 whitespace-nowrap">Date</TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:px-4 sm:py-3 whitespace-nowrap">Reference</TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:px-4 sm:py-3 whitespace-nowrap">Exam</TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:px-4 sm:py-3 whitespace-nowrap">Course</TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:px-4 sm:py-3 whitespace-nowrap">Amount</TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:px-4 sm:py-3 whitespace-nowrap">Channel</TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:px-4 sm:py-3 whitespace-nowrap">Status</TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:px-4 sm:py-3 text-right whitespace-nowrap">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        {/* Smaller padding and font size for TableCell cells on mobile */}
                        <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1 sm:gap-2"> {/* Smaller gap on mobile */}
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" /> {/* Smaller icon on mobile */}
                            {payment.paymentDate ? format(new Date(payment.paymentDate), 'PP') : 'N/A'}
                          </div>
                        </TableCell>
                        {/* Truncate aggressively on mobile, allow more space on larger screens */}
                        <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-2 font-mono max-w-[80px] sm:max-w-[120px] truncate whitespace-nowrap">{payment.paymentReference}</TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-2 max-w-[100px] sm:max-w-[200px] truncate whitespace-nowrap">{payment.exam.title}</TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-2 whitespace-nowrap">
                          <Badge variant="outline" className="text-xs px-2 py-0.5">{payment.exam.course.code}</Badge> {/* Smaller badge */}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-2 font-medium whitespace-nowrap">₦{payment.amountPaid.toLocaleString()}</TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {getChannelIcon(payment.paymentChannel)}
                            <span className="text-xs sm:text-sm">{payment.paymentChannel}</span> {/* Smaller text for channel name */}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-2 whitespace-nowrap">{getStatusBadge(payment.paymentStatus)}</TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-2 text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="icon" // Use icon size for mobile button, sm for larger screens
                            className="h-7 w-7 sm:h-8 sm:w-auto" // Adjust button size
                            onClick={() => handleDownloadReceipt(payment)}
                            disabled={payment.paymentStatus !== 'PAID'}
                          >
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4" /> {/* Smaller icon */}
                            <span className="hidden sm:inline ml-1">Receipt</span> {/* Hide text on mobile, show on sm and up */}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination (kept separate from overflow-x-auto, correctly has its own padding) */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t px-4 sm:px-6">
                  <p className="text-xs sm:text-sm text-muted-foreground"> {/* Smaller text on mobile */}
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden md:inline">Previous</span> {/* Hide on small mobile, show on md and up */}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <span className="hidden md:inline">Next</span> {/* Hide on small mobile, show on md and up */}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamPaymentHistoryPage;