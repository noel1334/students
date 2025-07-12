import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CourseRegistration } from '@/services/courseApiService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CourseFormDownloaderProps {
  registrations: CourseRegistration[];
}

const CourseFormDownloader = ({ registrations }: CourseFormDownloaderProps) => {
  const { user } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!formRef.current || !user) return;

    try {
      const canvas = await html2canvas(formRef.current);
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
    }
  };

  if (!registrations || registrations.length === 0) {
    return null;
  }

  return (
    <div>
      <Button onClick={downloadPDF} className="mb-4">
        <Download className="mr-2 h-4 w-4" />
        Download Course Form
      </Button>

      {/* Hidden form for PDF generation */}
      <div ref={formRef} className="hidden print:block bg-white p-8" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header with logos and title */}
        <div className="flex justify-between items-start mb-8">
          {/* Student Profile Image */}
          <div className="w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Student" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-2xl font-bold text-gray-600">
                {user?.avatarLetter || user?.name?.charAt(0) || 'S'}
              </span>
            )}
          </div>

          {/* Center Title */}
          <div className="flex-1 text-center px-4">
            <h1 className="text-xl font-bold mb-2">COURSE REGISTRATION FORM</h1>
            <p className="text-lg font-semibold">{user?.currentSeasonName}</p>
            <p className="text-md">{user?.currentSemesterName}</p>
          </div>

          {/* School Logo */}
          <div className="w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
            <span className="text-sm font-bold text-gray-600">SCHOOL LOGO</span>
          </div>
        </div>

        {/* Student Details */}
        <div className="mb-8 grid grid-cols-2 gap-4">
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
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Registered Courses</h3>
          <table className="w-full border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">S/N</th>
                <th className="border border-black p-2 text-left">Course Code</th>
                <th className="border border-black p-2 text-left">Course Title</th>
                <th className="border border-black p-2 text-left">Units</th>
                <th className="border border-black p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration, index) => (
                <tr key={registration.id}>
                  <td className="border border-black p-2">{index + 1}</td>
                  <td className="border border-black p-2 font-medium">{registration.course.code}</td>
                  <td className="border border-black p-2">{registration.course.title}</td>
                  <td className="border border-black p-2">{registration.course.creditUnit}</td>
                  <td className="border border-black p-2">Registered</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4">
            <p><strong>Total Units:</strong> {registrations.reduce((sum, reg) => sum + reg.course.creditUnit, 0)}</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="border-t border-black mt-12 pt-2">
              <p className="font-bold">Student Signature</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black mt-12 pt-2">
              <p className="font-bold">Academic Advisor</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black mt-12 pt-2">
              <p className="font-bold">HOD Signature</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Generated on: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseFormDownloader;