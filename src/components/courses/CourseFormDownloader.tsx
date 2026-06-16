// src/components/courses/CourseFormDownloader.tsx

import React, { useRef, cloneElement, ReactElement } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CourseRegistration } from '@/services/courseApiService';
import { useUniversitySettings } from '@/hooks/useUniversitySettings';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CourseFormDownloaderProps {
  registrations: CourseRegistration[];
  children: ReactElement; // Accepts a React element (the button) as children
  mode?: 'download' | 'print';
}

const CourseFormDownloader = ({ registrations, children, mode = 'download' }: CourseFormDownloaderProps) => {
  const { user } = useAuth();
  const { data: universitySettings } = useUniversitySettings();
  const formRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!formRef.current || !user) {
      console.warn('PDF download skipped: formRef.current or user is missing.');
      return;
    }

    try {
      // --- IMPORTANT: Make the element temporarily visible for html2canvas ---
      formRef.current.classList.remove('hidden'); // Temporarily make it visible


      const canvas = await html2canvas(formRef.current, {
        useCORS: true, // Important if you have images from different origins (e.g., user profile image, school logo)
        // Adjust scale for higher quality PDF, but can increase processing time
        // scale: 2,
      });

      // --- IMPORTANT: Hide the element again after capturing ---
      formRef.current.classList.add('hidden'); // Hide it again


      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${user.regNo || 'student'}_course_registration.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      // You might want to show a toast message to the user here
      // import { useToast } from '@/hooks/use-toast'; and then const { toast } = useToast();
      // toast({ title: "PDF Download Failed", description: "Could not generate the course form. Please try again.", variant: "destructive" });
    }
  };

  const printForm = () => {
    if (!formRef.current || !user) return;
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) return;
    const content = formRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Course Registration Form</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; color: #000; background: #fff; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  if (!registrations || registrations.length === 0) {
    return null; // Don't render anything if there are no registrations
  }

  return (
    <>
      {/* Clone the child element (the Button) and add the onClick handler */}
      {cloneElement(children, { onClick: mode === 'print' ? printForm : downloadPDF })}

      {/* Hidden form for PDF generation - only visible to print media or temporarily by JS */}
      {/* Keeping 'print:block' for actual printing if needed, but 'hidden' is problematic. */}
      <div ref={formRef} className="hidden" style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#ffffff', padding: '32px', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
        {/* Header with logos and title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          {/* Student Profile Image */}
          <div style={{ width: '80px', height: '80px', border: '2px solid #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#4b5563' }}>
                {user?.avatarLetter || user?.name?.charAt(0) || 'S'}
              </span>
            )}
          </div>

          {/* Center Title */}
          <div style={{ flex: 1, textAlign: 'center', padding: '0 16px' }}>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', color: '#000000' }}>COURSE REGISTRATION FORM</h1>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>{user?.currentSeasonName}</p>
            <p style={{ fontSize: '12px', color: '#374151' }}>{user?.currentSemesterName}</p>
          </div>

          {/* School Logo */}
          <div style={{ width: '80px', height: '80px', border: '2px solid #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
            <img 
              src={universitySettings?.logoUrl || "/lovable-uploads/7383ea93-4c04-4010-aab8-ce6d9fcba973.png"}
              alt={universitySettings?.acronym || "School Logo"}
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
        </div>

        {/* Student Details */}
        <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#000000' }}>
          <div>
            <p><strong>Student Name:</strong> {user?.name || 'N/A'}</p>
            <p><strong>Registration No:</strong> {user?.regNo || 'N/A'}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            <p><strong>Department:</strong> {user?.departmentName || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Program of Study:</strong> {user?.programName || 'N/A'}</p>
            <p><strong>Study Mode:</strong> {user?.studyMode || 'N/A'}</p>
            <p><strong>Level:</strong> {user?.currentLevelName || 'N/A'}</p>
            <p><strong>Session:</strong> {user?.currentSeasonName || 'N/A'}</p>
          </div>
        </div>

        {/* Course Table */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#000000' }}>Registered Courses</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ border: '1px solid #000000', padding: '4px 8px', textAlign: 'left', color: '#000000' }}>S/N</th>
                <th style={{ border: '1px solid #000000', padding: '4px 8px', textAlign: 'left', color: '#000000' }}>Course Code</th>
                <th style={{ border: '1px solid #000000', padding: '4px 8px', textAlign: 'left', color: '#000000' }}>Course Title</th>
                <th style={{ border: '1px solid #000000', padding: '4px 8px', textAlign: 'left', color: '#000000' }}>Units</th>
                <th style={{ border: '1px solid #000000', padding: '4px 8px', textAlign: 'left', color: '#000000' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration, index) => (
                <tr key={registration.id}>
                  <td style={{ border: '1px solid #000000', padding: '4px 8px', color: '#000000' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px 8px', fontWeight: '500', color: '#000000' }}>{registration.course.code}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px 8px', color: '#000000' }}>{registration.course.title}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px 8px', color: '#000000' }}>{registration.course.creditUnit}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px 8px', color: '#000000' }}>Registered</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '8px', fontSize: '12px', color: '#000000' }}>
            <p><strong>Total Units:</strong> {registrations.reduce((sum, reg) => sum + reg.course.creditUnit, 0)}</p>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            {user?.signatureImage ? (
              <div style={{ marginBottom: '4px' }}>
                <img 
                  src={user.signatureImage} 
                  alt="Student Signature" 
                  style={{ maxHeight: '40px', maxWidth: '100%', objectFit: 'contain', margin: '0 auto' }} 
                />
              </div>
            ) : (
              <div style={{ height: '32px' }}></div>
            )}
            <div style={{ borderTop: '1px solid #000000', paddingTop: '4px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '12px', color: '#000000' }}>Student Signature</p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #000000', marginTop: '32px', paddingTop: '4px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '12px', color: '#000000' }}>Academic Advisor</p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #000000', marginTop: '32px', paddingTop: '4px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '12px', color: '#000000' }}>HOD Signature</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#4b5563' }}>
          <p>Generated on: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </>
  );
};

export default CourseFormDownloader;