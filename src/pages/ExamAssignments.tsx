import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Download, Eye, Calendar, MapPin, Clock, FileText } from 'lucide-react';
import { getMyExamAssignments, ExamAssignment } from '@/services/examAssignmentApiService';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';

const ExamAssignments = () => {
  const [assignments, setAssignments] = useState<ExamAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<ExamAssignment | null>(null);
   const { user } = useAuth();

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

  const handleDownload = (assignment: ExamAssignment) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CBT Exam Schedule', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Student Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${assignment.student.name}`, 20, yPos);
    yPos += 7;
    doc.text(`Registration No: ${assignment.student.regNo}`, 20, yPos);
    yPos += 7;
    doc.text(`Email: ${assignment.student.email}`, 20, yPos);
    yPos += 7;
    doc.text(`Department: ${assignment.student.department.name}`, 20, yPos);
    yPos += 7;
    doc.text(`Program: ${assignment.student.program.name}`, 20, yPos);
    yPos += 12;

    // Exam Details
    doc.setFont('helvetica', 'bold');
    doc.text('Exam Details', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Course: ${assignment.examSession.exam.course.code} - ${assignment.examSession.exam.course.title}`, 20, yPos);
    yPos += 7;
    doc.text(`Exam Title: ${assignment.examSession.exam.title}`, 20, yPos);
    yPos += 7;
    doc.text(`Exam Type: ${assignment.examSession.exam.examType}`, 20, yPos);
    yPos += 12;

    // Session Details
    doc.setFont('helvetica', 'bold');
    doc.text('Session Details', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Session: ${assignment.examSession.sessionName}`, 20, yPos);
    yPos += 7;
    doc.text(`Date: ${format(new Date(assignment.examSession.startTime), 'PPP')}`, 20, yPos);
    yPos += 7;
    doc.text(`Time: ${format(new Date(assignment.examSession.startTime), 'p')} - ${format(new Date(assignment.examSession.endTime), 'p')}`, 20, yPos);
    yPos += 7;
    if (assignment.examSession.venue) {
      doc.text(`Venue: ${assignment.examSession.venue.name}`, 20, yPos);
      yPos += 7;
      doc.text(`Location: ${assignment.examSession.venue.location}`, 20, yPos);
      yPos += 7;
    }
    if (assignment.seatNumber) {
      doc.text(`Seat Number: ${assignment.seatNumber}`, 20, yPos);
    }

    doc.save(`exam-assignment-${assignment.student.regNo}-${assignment.examSession.exam.course.code}.pdf`);
    toast.success('Assignment downloaded successfully');
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
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
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
                <Button onClick={() => handleDownload(selectedAssignment)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExamAssignments;
