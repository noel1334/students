import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Download, Eye, Calendar, Clock, FileText, Loader2 } from 'lucide-react';
import { getMyExamAssignments, ExamAssignment } from '@/services/examAssignmentApiService';
import { getPaymentStatus } from '@/services/examPaymentApiService';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
// --- RESOLVED MERGE CONFLICT (IMPORTS) ---
import { useAuth } from '@/contexts/AuthContext';
import ExamCountdown from '@/components/ExamCountdown';
import ExamPaymentModal from '@/components/ExamPaymentModal';
// ------------------------------------------

const ExamAssignments = () => {
  const [assignments, setAssignments] = useState<ExamAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<ExamAssignment | null>(null);
  // --- RESOLVED MERGE CONFLICT (STATE/HOOKS) ---
  const { user } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedExamForPayment, setSelectedExamForPayment] = useState<{
    examId: number;
    examTitle: string;
    amount: number;
  } | null>(null);
  const [checkingPayment, setCheckingPayment] = useState<number | null>(null);
  // ---------------------------------------------

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await getMyExamAssignments();
      console.log('Fetched assignments data:', data);
      console.log('Assignments array:', data.assignments);
      console.log('Total assignments:', data.totalAssignments);
      setAssignments(data.assignments);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      toast.error(error.response?.data?.message || 'Failed to load exam assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (assignment: ExamAssignment) => {
    setSelectedAssignment(assignment);
  };

  const handleDownload = async (assignment: ExamAssignment) => {
    try {
      setCheckingPayment(assignment.examSession.exam.id);
      
      // Check payment status
      const paymentStatus = await getPaymentStatus(assignment.examSession.exam.id);
      
      if (paymentStatus.status === 'NOT_REQUIRED') {
        // No payment required, proceed with download
        generatePDF(assignment);
      } else if (paymentStatus.status === 'PAID') {
        // Payment already completed, proceed with download
        generatePDF(assignment);
      } else {
        // Payment required
        setSelectedExamForPayment({
          examId: assignment.examSession.exam.id,
          examTitle: `${assignment.examSession.exam.course.code} - ${assignment.examSession.exam.title}`,
          amount: paymentStatus.feeDetails?.amount || 0
        });
        setPaymentModalOpen(true);
      }
    } catch (error: any) {
      console.error('Error checking payment status:', error);
      toast.error('Failed to check payment status');
    } finally {
      setCheckingPayment(null);
    }
  };

  const generatePDF = async (assignment: ExamAssignment) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add border
    doc.setDrawColor(0, 100, 200);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Add inner border
    doc.setLineWidth(0.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    let yPos = 30;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text('CBT EXAM ENTRY PASS', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 15;
    
    // Profile Image
    if (assignment.student.profileImg) {
      try {
        const imgData = assignment.student.profileImg;
        doc.addImage(imgData, 'JPEG', pageWidth / 2 - 20, yPos, 40, 40);
        yPos += 45;
      } catch (error) {
        console.error('Error adding profile image:', error);
        yPos += 5;
      }
    } else {
      yPos += 5;
    }

    // Student Information Section
    doc.setFillColor(240, 248, 255);
    doc.rect(20, yPos, pageWidth - 40, 50, 'F');
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('STUDENT INFORMATION', 25, yPos);
    
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${assignment.student.name}`, 25, yPos);
    yPos += 6;
    doc.text(`Registration No: ${assignment.student.regNo}`, 25, yPos);
    yPos += 6;
    doc.text(`Department: ${assignment.student.department.name}`, 25, yPos);
    yPos += 6;
    doc.text(`Program: ${assignment.student.program.name} (${assignment.student.program.degree})`, 25, yPos);
    yPos += 6;
    doc.text(`Level: ${assignment.student.currentLevel?.name || 'N/A'}`, 25, yPos);
    
    yPos += 15;

    // Exam Details Section
    doc.setFillColor(255, 250, 240);
    doc.rect(20, yPos, pageWidth - 40, 40, 'F');
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EXAM DETAILS', 25, yPos);
    
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Course: ${assignment.examSession.exam.course.code} - ${assignment.examSession.exam.course.title}`, 25, yPos);
    yPos += 6;
    doc.text(`Exam Type: ${assignment.examSession.exam.examType}`, 25, yPos);
    yPos += 6;
    doc.text(`Session: ${assignment.examSession.sessionName}`, 25, yPos);
    
    yPos += 15;

    // Session Details Section
    doc.setFillColor(240, 255, 240);
    doc.rect(20, yPos, pageWidth - 40, 35, 'F');
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SESSION DETAILS', 25, yPos);
    
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${format(new Date(assignment.examSession.startTime), 'EEEE, MMMM do, yyyy')}`, 25, yPos);
    yPos += 6;
    doc.text(`Time: ${format(new Date(assignment.examSession.startTime), 'h:mm a')} - ${format(new Date(assignment.examSession.endTime), 'h:mm a')}`, 25, yPos);
    
    if (assignment.examSession.venue) {
      yPos += 6;
      doc.text(`Venue: ${assignment.examSession.venue.name}`, 25, yPos);
      yPos += 6;
      doc.text(`Location: ${assignment.examSession.venue.location}`, 25, yPos);
    }
    
    if (assignment.seatNumber) {
      yPos += 6;
      doc.setFont('helvetica', 'bold');
      doc.text(`Seat Number: ${assignment.seatNumber}`, 25, yPos);
    }

    // Footer
    yPos = pageHeight - 35;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('This is an official exam entry pass. Present this at the examination venue.', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, pageWidth / 2, yPos, { align: 'center' });

    doc.save(`exam-pass-${assignment.student.regNo}-${assignment.examSession.exam.course.code}.pdf`);
    toast.success('Exam pass downloaded successfully');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">CBT Exam Schedule</h1>
        <p className="text-muted-foreground">View and download your exam session assignments</p>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No exam assignments found</p>
            <p className="text-sm text-muted-foreground mt-2">You don't have any exam sessions assigned yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  {/* Profile Image */}
                  <div className="w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Student" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-2xl font-bold text-gray-600">
                {user?.avatarLetter || user?.name?.charAt(0) || 'S'}
              </span>
            )}
          </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-3">
                    {/* Header with Title and Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {assignment.examSession.exam.course.code} - {assignment.examSession.exam.course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {assignment.examSession.exam.title}
                        </p>
                      </div>
                      <Badge variant={assignment.examSession.isActive ? 'default' : 'secondary'}>
                        {assignment.examSession.exam.examType}
                      </Badge>
                    </div>

                    {/* Student Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Student:</span>{' '}
                        <span className="font-medium text-foreground">{assignment.student.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reg No:</span>{' '}
                        <span className="font-medium text-foreground">{assignment.student.regNo}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Department:</span>{' '}
                        <span className="font-medium text-foreground">{assignment.student.department.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Program:</span>{' '}
                        <span className="font-medium text-foreground">{assignment.student.program.name}</span>
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Date & Time</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(assignment.examSession.startTime), 'PPP')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(assignment.examSession.startTime), 'p')} - {format(new Date(assignment.examSession.endTime), 'p')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Session</p>
                          <p className="text-sm text-muted-foreground">{assignment.examSession.sessionName}</p>
                          {assignment.seatNumber && (
                            <p className="text-sm text-muted-foreground">Seat: {assignment.seatNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="pt-2">
                      <ExamCountdown startTime={assignment.examSession.startTime} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(assignment)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleDownload(assignment)}
                        disabled={checkingPayment === assignment.examSession.exam.id}
                      >
                        {checkingPayment === assignment.examSession.exam.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download Pass
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Details Modal/Card */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAssignment(null)}>
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Exam Assignment Details</CardTitle>
              <CardDescription>Complete information about your exam session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Student Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedAssignment.student.name}</p>
                  <p><span className="font-medium">Registration No:</span> {selectedAssignment.student.regNo}</p>
                  <p><span className="font-medium">Email:</span> {selectedAssignment.student.email}</p>
                  <p><span className="font-medium">Department:</span> {selectedAssignment.student.department.name}</p>
                  <p><span className="font-medium">Program:</span> {selectedAssignment.student.program.name}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Exam Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Course:</span> {selectedAssignment.examSession.exam.course.code} - {selectedAssignment.examSession.exam.course.title}</p>
                  <p><span className="font-medium">Exam Title:</span> {selectedAssignment.examSession.exam.title}</p>
                  <p><span className="font-medium">Exam Type:</span> {selectedAssignment.examSession.exam.examType}</p>
                  <p><span className="font-medium">Status:</span> <Badge variant="outline">{selectedAssignment.examSession.exam.status}</Badge></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Session:</span> {selectedAssignment.examSession.sessionName}</p>
                  <p><span className="font-medium">Date:</span> {format(new Date(selectedAssignment.examSession.startTime), 'PPP')}</p>
                  <p><span className="font-medium">Time:</span> {format(new Date(selectedAssignment.examSession.startTime), 'p')} - {format(new Date(selectedAssignment.examSession.endTime), 'p')}</p>
                  {selectedAssignment.examSession.venue && (
                    <>
                      <p><span className="font-medium">Venue:</span> {selectedAssignment.examSession.venue.name}</p>
                      <p><span className="font-medium">Location:</span> {selectedAssignment.examSession.venue.location}</p>
                    </>
                  )}
                  {selectedAssignment.seatNumber && (
                    <p><span className="font-medium">Seat Number:</span> {selectedAssignment.seatNumber}</p>
                  )}
                  <p><span className="font-medium">Assigned At:</span> {format(new Date(selectedAssignment.assignedAt), 'PPP p')}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setSelectedAssignment(null)} variant="outline" className="flex-1">
                  Close
                </Button>
                <Button 
                  onClick={() => handleDownload(selectedAssignment)} 
                  className="flex-1"
                  disabled={checkingPayment === selectedAssignment.examSession.exam.id}
                >
                  {checkingPayment === selectedAssignment.examSession.exam.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Pass
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Modal */}
      {selectedExamForPayment && (
        <ExamPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          examId={selectedExamForPayment.examId}
          examTitle={selectedExamForPayment.examTitle}
          amount={selectedExamForPayment.amount}
          onPaymentInitialized={() => {
            setPaymentModalOpen(false);
            setSelectedExamForPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default ExamAssignments;