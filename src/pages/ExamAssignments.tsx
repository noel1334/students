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
    // Use inline styles to ensure colors are not affected by dark mode
    return (
      <div
        ref={ref}
        style={{ 
          width: "210mm", 
          minHeight: "297mm", 
          backgroundColor: "#ffffff",
          padding: "32px",
          color: "#1f2937"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937", margin: 0 }}>
              EXAM ENTRY PASS
            </h1>
            <p style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>
              {assignment.examSession.exam.title}
            </p>
          </div>
          <div style={{ 
            width: "96px", 
            height: "96px", 
            border: "2px solid #e5e7eb", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            backgroundColor: "#f9fafb" 
          }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#6b7280", textAlign: "center" }}>
              SCHOOL LOGO
            </span>
          </div>
        </div>

        {/* Student Details */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "8px 48px", fontSize: "14px" }}>
            <strong style={{ color: "#4b5563" }}>Student Name:</strong>
            <span style={{ color: "#1f2937" }}>{assignment.student.name}</span>

            <strong style={{ color: "#4b5563" }}>Program of Study:</strong>
            <span style={{ color: "#1f2937" }}>
              {assignment.student.program.name}
            </span>

            <strong style={{ color: "#4b5563" }}>Registration No:</strong>
            <span style={{ color: "#1f2937" }}>{assignment.student.regNo}</span>

            <strong style={{ color: "#4b5563" }}>Level:</strong>
            <span style={{ color: "#1f2937" }}>
              {assignment.student.currentLevel?.name || "N/A"}
            </span>

            <strong style={{ color: "#4b5563" }}>Department:</strong>
            <span style={{ color: "#1f2937" }}>
              {assignment.student.department.name}
            </span>

            <strong style={{ color: "#4b5563" }}>Session:</strong>
            <span style={{ color: "#1f2937" }}>
              {assignment.examSession.sessionName}
            </span>
          </div>

          {/* Student Photo */}
          <div style={{ 
            width: "128px", 
            height: "160px", 
            border: "2px solid #d1d5db", 
            borderRadius: "4px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            backgroundColor: "#f3f4f6", 
            padding: "4px" 
          }}>
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Student"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                crossOrigin="anonymous"
              />
            ) : (
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Student Photo</span>
            )}
          </div>
        </div>

        {/* Examination Details Table */}
        <div style={{ marginBottom: "48px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px", color: "#1f2937" }}>
            Examination Details
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ fontWeight: "bold", padding: "8px", paddingRight: "16px", backgroundColor: "#f9fafb", width: "160px", color: "#1f2937" }}>Course:</td>
                <td style={{ padding: "8px", color: "#1f2937" }}>{`${assignment.examSession.exam.course.code} - ${assignment.examSession.exam.course.title}`}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ fontWeight: "bold", padding: "8px", paddingRight: "16px", backgroundColor: "#f9fafb", color: "#1f2937" }}>Date:</td>
                <td style={{ padding: "8px", color: "#1f2937" }}>
                  {format(
                    new Date(assignment.examSession.startTime),
                    "EEEE, MMMM do, yyyy"
                  )}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ fontWeight: "bold", padding: "8px", paddingRight: "16px", backgroundColor: "#f9fafb", color: "#1f2937" }}>Time:</td>
                <td style={{ padding: "8px", color: "#1f2937" }}>{`${format(
                  new Date(assignment.examSession.startTime),
                  "h:mm a"
                )} - ${format(
                  new Date(assignment.examSession.endTime),
                  "h:mm a"
                )}`}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ fontWeight: "bold", padding: "8px", paddingRight: "16px", backgroundColor: "#f9fafb", color: "#1f2937" }}>Venue:</td>
                <td style={{ padding: "8px", color: "#1f2937" }}>{`${
                  assignment.examSession.venue?.name || "N/A"
                } (${assignment.examSession.venue?.location || "N/A"})`}</td>
              </tr>
              <tr style={{ backgroundColor: "#fef2f2" }}>
                <td style={{ fontWeight: "bold", padding: "8px", paddingRight: "16px", color: "#b91c1c" }}>
                  Seat Number:
                </td>
                <td style={{ padding: "8px", fontWeight: "bold", fontSize: "18px", color: "#b91c1c" }}>
                  {assignment.seatNumber || "NOT ASSIGNED"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* QR Code and Instructions */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "32px" }}>
          {/* QR Code */}
          <div style={{ textAlign: "center" }}>
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="QR Code" style={{ width: "96px", height: "96px" }} />
            )}
          </div>
          {/* Instructions */}
          <div>
            <h4 style={{ fontWeight: "bold", fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
              Instructions to Candidate:
            </h4>
            <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "12px", color: "#4b5563" }}>
              <li style={{ marginBottom: "4px" }}>
                This pass is required for entry into the examination hall.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Please arrive at the venue 30 minutes before the scheduled start time.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Mobile phones and any electronic gadgets are strictly prohibited.
              </li>
              <li style={{ marginBottom: "4px" }}>
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
