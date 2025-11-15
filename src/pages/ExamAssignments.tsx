import React, { useState, useEffect, useRef, forwardRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Download,
  Eye,
  Calendar,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import {
  getMyExamAssignments,
  ExamAssignment,
} from "@/services/examAssignmentApiService";
import { getPaymentStatus } from "@/services/examPaymentApiService";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import ExamCountdown from "@/components/ExamCountdown";
import ExamPaymentModal from "@/components/ExamPaymentModal";

// --- NEW IMPORTS ---
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode"; // Make sure this is imported

// =====================================================================================
// === 1. UPDATED COMPONENT: The visual template for our PDF, now with QR/Instructions ===
// =====================================================================================
interface ExamPassLayoutProps {
  assignment: ExamAssignment;
  user: any;
  qrCodeUrl: string | null; // Pass the generated QR code URL as a prop
}

const ExamPassLayout = forwardRef<HTMLDivElement, ExamPassLayoutProps>(
  ({ assignment, user, qrCodeUrl }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white p-8"
        style={{ width: "210mm", minHeight: "297mm" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-800">
              EXAM ENTRY PASS
            </h1>
            <p className="text-md text-gray-600">
              {assignment.examSession.exam.title}
            </p>
          </div>
          <div className="w-24 h-24 border-2 border-gray-200 flex items-center justify-center bg-gray-50">
            <span className="text-sm font-bold text-gray-500 text-center">
              SCHOOL LOGO
            </span>
          </div>
        </div>

        {/* Student Details */}
        <div className="flex justify-between items-start mb-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <strong className="text-gray-600">Student Name:</strong>
            <span className="text-gray-800">{assignment.student.name}</span>

            <strong className="text-gray-600">Program of Study:</strong>
            <span className="text-gray-800">
              {assignment.student.program.name}
            </span>

            <strong className="text-gray-600">Registration No:</strong>
            <span className="text-gray-800">{assignment.student.regNo}</span>

            <strong className="text-gray-600">Level:</strong>
            <span className="text-gray-800">
              {assignment.student.currentLevel?.name || "N/A"}
            </span>

            <strong className="text-gray-600">Department:</strong>
            <span className="text-gray-800">
              {assignment.student.department.name}
            </span>

            <strong className="text-gray-600">Session:</strong>
            <span className="text-gray-800">
              {assignment.examSession.sessionName}
            </span>
          </div>

          {/* Student Photo */}
          <div className="w-32 h-40 border-2 border-gray-300 rounded flex items-center justify-center bg-gray-100 p-1">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Student"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <span className="text-xs text-gray-500">Student Photo</span>
            )}
          </div>
        </div>

        {/* Examination Details Table */}
        <div className="mb-12">
          {" "}
          {/* Added more bottom margin */}
          <h3 className="text-lg font-bold mb-2 text-gray-800">
            Examination Details
          </h3>
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="font-bold py-2 pr-4 bg-gray-50 w-40">Course:</td>
                <td className="py-2">{`${assignment.examSession.exam.course.code} - ${assignment.examSession.exam.course.title}`}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-bold py-2 pr-4 bg-gray-50">Date:</td>
                <td className="py-2">
                  {format(
                    new Date(assignment.examSession.startTime),
                    "EEEE, MMMM do, yyyy"
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-bold py-2 pr-4 bg-gray-50">Time:</td>
                <td className="py-2">{`${format(
                  new Date(assignment.examSession.startTime),
                  "h:mm a"
                )} - ${format(
                  new Date(assignment.examSession.endTime),
                  "h:mm a"
                )}`}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-bold py-2 pr-4 bg-gray-50">Venue:</td>
                <td className="py-2">{`${
                  assignment.examSession.venue?.name || "N/A"
                } (${assignment.examSession.venue?.location || "N/A"})`}</td>
              </tr>
              <tr className="bg-red-50">
                <td className="font-bold py-2 pr-4 text-red-700">
                  Seat Number:
                </td>
                <td className="py-2 font-bold text-lg text-red-700">
                  {assignment.seatNumber || "NOT ASSIGNED"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ====================================================================== */}
        {/* === THIS IS THE NEW SECTION THAT WAS MISSING                       === */}
        {/* ====================================================================== */}
        <div className="flex items-start gap-8">
          {/* QR Code */}
          <div className="text-center">
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24" />
            )}
          </div>
          {/* Instructions */}
          <div>
            <h4 className="font-bold text-sm text-gray-700 mb-2">
              Instructions to Candidate:
            </h4>
            <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
              <li>
                This pass is required for entry into the examination hall.
              </li>
              <li>
                Please arrive at the venue 30 minutes before the scheduled start
                time.
              </li>
              <li>
                Mobile phones and any electronic gadgets are strictly
                prohibited.
              </li>
              <li>
                You must present your Student ID card along with this pass.
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
);

const ExamAssignments = () => {
  const [assignments, setAssignments] = useState<ExamAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ExamAssignment | null>(null);
  const { user } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedExamForPayment, setSelectedExamForPayment] = useState<{
    examId: number;
    examTitle: string;
    amount: number;
  } | null>(null);
  const [checkingPayment, setCheckingPayment] = useState<number | null>(null);

  const pdfLayoutRef = useRef<HTMLDivElement>(null);
  const [assignmentForPdf, setAssignmentForPdf] =
    useState<ExamAssignment | null>(null);
  // --- NEW STATE: To hold the generated QR code Data URL ---
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  // This effect now triggers the PDF generation only after QR code is also ready
  useEffect(() => {
    if (assignmentForPdf && qrCodeUrl && pdfLayoutRef.current) {
      generatePDF();
    }
  }, [assignmentForPdf, qrCodeUrl]);

  const fetchAssignments = async () => {
    /* ...fetch logic... */
    try {
      setLoading(true);
      const data = await getMyExamAssignments();
      setAssignments(data.assignments);
    } catch (error: any) {
      console.error("Error fetching assignments:", error);
      toast.error(
        error.response?.data?.message || "Failed to load exam assignments"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleSuccessfulPayment = () => {
    /* ...payment success logic... */
    toast.info("Payment successful, updating your exam status...");
    fetchAssignments();
    setPaymentModalOpen(false);
    setSelectedExamForPayment(null);
  };
  const handleView = (assignment: ExamAssignment) => {
    setSelectedAssignment(assignment);
  };

 const handleDownload = async (assignment: ExamAssignment) => {
    try {
        setCheckingPayment(assignment.examSession.exam.id);
        const paymentStatus = await getPaymentStatus(
            assignment.examSession.exam.id
        );

        // --- THIS IS THE UPDATED LOGIC ---

        if (paymentStatus.status === "PAID") {
            // Logic to generate QR code and prepare PDF
            const qrData = `RegNo: ${assignment.student.regNo}\nCourse: ${assignment.examSession.exam.course.code}\nSeat: ${assignment.seatNumber || "N/A"}`;
            const qrUrl = await QRCode.toDataURL(qrData);
            setQrCodeUrl(qrUrl);
            setAssignmentForPdf(assignment);

        } else if (paymentStatus.status === 'FEE_NOT_CONFIGURED') {
            // Handle the new error case: show a specific error message
            toast.error("Action Required by Admin", {
                description: paymentStatus.message,
            });

        } else {
            // This now correctly handles 'NOT_PAID' and other statuses
            setSelectedExamForPayment({
                examId: assignment.examSession.exam.id,
                examTitle: `${assignment.examSession.exam.course.code} - ${assignment.examSession.exam.title}`,
                amount: paymentStatus.feeDetails?.amount || 0,
            });
            setPaymentModalOpen(true);
        }

    } catch (error: any) {
        console.error("Error during download prep:", error);
        toast.error(error.response?.data?.message || "Failed to prepare exam pass");
    } finally {
        setCheckingPayment(null);
    }
};
  const generatePDF = async () => {
    if (!pdfLayoutRef.current || !assignmentForPdf) return;
    toast.info("Preparing your PDF...");

    try {
      const canvas = await html2canvas(pdfLayoutRef.current, {
        useCORS: true,
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Exam-Pass-${assignmentForPdf.student.regNo}.pdf`);
      toast.success("Exam pass downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF.");
    } finally {
      // --- Clean up state after we're done ---
      setAssignmentForPdf(null);
      setQrCodeUrl(null);
    }
  };

  if (loading) {
    /* ... Skeleton UI ... */
    return (
      <div className="container mx-auto p-6 space-y-6">
        {" "}
        <Skeleton className="h-12 w-64" />{" "}
        <div className="grid gap-4">
          {" "}
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}{" "}
        </div>{" "}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ... All your visible JSX for the page ... */}
      <div className="flex flex-col gap-2">
        {" "}
        <h1 className="text-3xl font-bold text-foreground">
          CBT Exam Schedule
        </h1>{" "}
        <p className="text-muted-foreground">
          View and download your exam session assignments
        </p>{" "}
      </div>
      {assignments.length === 0 ? (
        <Card>
          {" "}
          <CardContent className="flex flex-col items-center justify-center py-12">
            {" "}
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />{" "}
            <p className="text-lg font-medium text-muted-foreground">
              No exam assignments found
            </p>{" "}
            <p className="text-sm text-muted-foreground mt-2">
              You don't have any exam sessions assigned yet
            </p>{" "}
          </CardContent>{" "}
        </Card>
      ) : (
        <div className="grid gap-4">
          {" "}
          {assignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="hover:shadow-md transition-shadow"
            >
              {" "}
              <CardContent className="pt-6">
                {" "}
                <div className="flex gap-4 items-start">
                  {" "}
                  <div className="w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                    {" "}
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Student"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-600">
                        {" "}
                        {user?.avatarLetter ||
                          user?.name?.charAt(0) ||
                          "S"}{" "}
                      </span>
                    )}{" "}
                  </div>
                  <div className="flex-1 space-y-3">
                    {" "}
                    <div className="flex items-start justify-between gap-4">
                      {" "}
                      <div>
                        {" "}
                        <h3 className="text-xl font-semibold text-foreground">
                          {" "}
                          {assignment.examSession.exam.course.code} -{" "}
                          {assignment.examSession.exam.course.title}{" "}
                        </h3>{" "}
                        <p className="text-sm text-muted-foreground mt-1">
                          {" "}
                          {assignment.examSession.exam.title}{" "}
                        </p>{" "}
                      </div>{" "}
                      <Badge
                        variant={
                          assignment.examSession.isActive
                            ? "default"
                            : "secondary"
                        }
                      >
                        {" "}
                        {assignment.examSession.exam.examType}{" "}
                      </Badge>{" "}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {" "}
                      <div>
                        {" "}
                        <span className="text-muted-foreground">
                          Student:
                        </span>{" "}
                        <span className="font-medium text-foreground">
                          {assignment.student.name}
                        </span>{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <span className="text-muted-foreground">
                          Reg No:
                        </span>{" "}
                        <span className="font-medium text-foreground">
                          {assignment.student.regNo}
                        </span>{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <span className="text-muted-foreground">
                          Department:
                        </span>{" "}
                        <span className="font-medium text-foreground">
                          {assignment.student.department.name}
                        </span>{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <span className="text-muted-foreground">
                          Program:
                        </span>{" "}
                        <span className="font-medium text-foreground">
                          {assignment.student.program.name}
                        </span>{" "}
                      </div>{" "}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {" "}
                      <div className="flex items-start gap-3">
                        {" "}
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />{" "}
                        <div>
                          {" "}
                          <p className="text-sm font-medium text-foreground">
                            Date & Time
                          </p>{" "}
                          <p className="text-sm text-muted-foreground">
                            {" "}
                            {format(
                              new Date(assignment.examSession.startTime),
                              "PPP"
                            )}{" "}
                          </p>{" "}
                          <p className="text-sm text-muted-foreground">
                            {" "}
                            {format(
                              new Date(assignment.examSession.startTime),
                              "p"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(assignment.examSession.endTime),
                              "p"
                            )}{" "}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className="flex items-start gap-3">
                        {" "}
                        <Clock className="h-5 w-5 text-primary mt-0.5" />{" "}
                        <div>
                          {" "}
                          <p className="text-sm font-medium text-foreground">
                            Session
                          </p>{" "}
                          <p className="text-sm text-muted-foreground">
                            {assignment.examSession.sessionName}
                          </p>{" "}
                          {assignment.seatNumber && (
                            <p className="text-sm text-muted-foreground">
                              Seat: {assignment.seatNumber}
                            </p>
                          )}{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>
                    <div className="pt-2">
                      {" "}
                      <ExamCountdown
                        startTime={assignment.examSession.startTime}
                      />{" "}
                    </div>
                    <div className="flex gap-2 pt-2">
                      {" "}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(assignment)}
                      >
                        {" "}
                        <Eye className="h-4 w-4 mr-2" /> View Details{" "}
                      </Button>{" "}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleDownload(assignment)}
                        disabled={
                          checkingPayment === assignment.examSession.exam.id
                        }
                      >
                        {" "}
                        {checkingPayment === assignment.examSession.exam.id ? (
                          <>
                            {" "}
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                            Checking...{" "}
                          </>
                        ) : (
                          <>
                            {" "}
                            <Download className="h-4 w-4 mr-2" /> Download Pass{" "}
                          </>
                        )}{" "}
                      </Button>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </CardContent>{" "}
            </Card>
          ))}{" "}
        </div>
      )}
      {selectedAssignment && (
        /* ... View Details Modal ... */ <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAssignment(null)}
        >
          {" "}
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            <CardHeader>
              {" "}
              <CardTitle>Exam Assignment Details</CardTitle>{" "}
              <CardDescription>
                Complete information about your exam session
              </CardDescription>{" "}
            </CardHeader>{" "}
            <CardContent className="space-y-6">
              {" "}
              <div>
                {" "}
                <h3 className="font-semibold text-lg mb-3">
                  Student Information
                </h3>{" "}
                <div className="space-y-2 text-sm">
                  {" "}
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedAssignment.student.name}
                  </p>{" "}
                  <p>
                    <span className="font-medium">Registration No:</span>{" "}
                    {selectedAssignment.student.regNo}
                  </p>{" "}
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedAssignment.student.email}
                  </p>{" "}
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {selectedAssignment.student.department.name}
                  </p>{" "}
                  <p>
                    <span className="font-medium">Program:</span>{" "}
                    {selectedAssignment.student.program.name}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <h3 className="font-semibold text-lg mb-3">
                  Exam Details
                </h3>{" "}
                <div className="space-y-2 text-sm">
                  {" "}
                  <p>
                    <span className="font-medium">Course:</span>{" "}
                    {selectedAssignment.examSession.exam.course.code} -{" "}
                    {selectedAssignment.examSession.exam.course.title}
                  </p>{" "}
                  <p>
                    <span className="font-medium">Exam Title:</span>{" "}
                    {selectedAssignment.examSession.exam.title}
                  </p>{" "}
                  <p>
                    <span className="font-medium">Exam Type:</span>{" "}
                    {selectedAssignment.examSession.exam.examType}
                  </p>{" "}
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <Badge variant="outline">
                      {selectedAssignment.examSession.exam.status}
                    </Badge>
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <h3 className="font-semibold text-lg mb-3">
                  Session Details
                </h3>{" "}
                <div className="space-y-2 text-sm">
                  {" "}
                  <p>
                    <span className="font-medium">Session:</span>{" "}
                    {selectedAssignment.examSession.sessionName}
                  </p>{" "}
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {format(
                      new Date(selectedAssignment.examSession.startTime),
                      "PPP"
                    )}
                  </p>{" "}
                  <p>
                    <span className="font-medium">Time:</span>{" "}
                    {format(
                      new Date(selectedAssignment.examSession.startTime),
                      "p"
                    )}{" "}
                    -{" "}
                    {format(
                      new Date(selectedAssignment.examSession.endTime),
                      "p"
                    )}
                  </p>{" "}
                 
                  {selectedAssignment.seatNumber && (
                    <p>
                      <span className="font-medium">Seat Number:</span>{" "}
                      {selectedAssignment.seatNumber}
                    </p>
                  )}{" "}
                  <p>
                    <span className="font-medium">Assigned At:</span>{" "}
                    {format(new Date(selectedAssignment.assignedAt), "PPP p")}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex gap-2 pt-4">
                {" "}
                <Button
                  onClick={() => setSelectedAssignment(null)}
                  variant="outline"
                  className="flex-1"
                >
                  {" "}
                  Close{" "}
                </Button>{" "}
                <Button
                  onClick={() => handleDownload(selectedAssignment)}
                  className="flex-1"
                  disabled={
                    checkingPayment === selectedAssignment.examSession.exam.id
                  }
                >
                  {" "}
                  {checkingPayment ===
                  selectedAssignment.examSession.exam.id ? (
                    <>
                      {" "}
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Checking...{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <Download className="h-4 w-4 mr-2" /> Download Pass{" "}
                    </>
                  )}{" "}
                </Button>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>
      )}
      {selectedExamForPayment && (
        /* ... Payment Modal ... */ <ExamPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          examId={selectedExamForPayment.examId}
          examTitle={selectedExamForPayment.examTitle}
          amount={selectedExamForPayment.amount}
          onPaymentSuccess={handleSuccessfulPayment}
        />
      )}

      {/* The hidden component for PDF generation */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
        {assignmentForPdf && (
          <ExamPassLayout
            ref={pdfLayoutRef}
            assignment={assignmentForPdf}
            user={user}
            qrCodeUrl={qrCodeUrl}
          />
        )}
      </div>
    </div>
  );
};

export default ExamAssignments;
