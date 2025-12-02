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
import autoTable from 'jspdf-autotable';
import { useIsMobile } from '@/hooks/use-mobile';
import { ExamPaymentCard } from '@/components/ExamPaymentCard';

const ExamPaymentHistoryPage = () => {
  const [payments, setPayments] = useState<ExamPaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const isMobile = useIsMobile();

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
    <div className="w-full p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Exam Payment History
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">View all your exam fee payments</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"> 
          <Button variant="outline" size="sm" onClick={fetchPayments} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportAll} disabled={payments.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Channel</label>
              <Select value={channelFilter} onValueChange={(value) => { setChannelFilter(value); setCurrentPage(1); }}>
                <SelectTrigger>
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

      {/* Payment Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Records</CardTitle>
          <CardDescription>
            {totalItems > 0 ? `Showing ${payments.length} of ${totalItems} payments` : 'No payments found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No payments found</h3>
              <p className="text-muted-foreground mt-1">You haven't made any exam fee payments yet.</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              {isMobile ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <ExamPaymentCard
                      key={payment.id}
                      payment={payment}
                      onDownloadReceipt={handleDownloadReceipt}
                    />
                  ))}
                </div>
              ) : (
                /* Desktop Table View */
                <div className="overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Date</TableHead>
                        <TableHead className="whitespace-nowrap">Reference</TableHead>
                        <TableHead className="whitespace-nowrap">Exam</TableHead>
                        <TableHead className="whitespace-nowrap">Course</TableHead>
                        <TableHead className="whitespace-nowrap">Amount</TableHead>
                        <TableHead className="whitespace-nowrap">Channel</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {payment.paymentDate ? format(new Date(payment.paymentDate), 'PP') : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm max-w-[150px] truncate">{payment.paymentReference}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{payment.exam.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.exam.course.code}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">₦{payment.amountPaid.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getChannelIcon(payment.paymentChannel)}
                              <span>{payment.paymentChannel}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.paymentStatus)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReceipt(payment)}
                              disabled={payment.paymentStatus !== 'PAID'}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Receipt
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
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