
import React, { useState, useRef } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/DashboardHeader';
import AcademicPerformance from '@/components/AcademicPerformance';
import { Download, Printer, FileText, ChevronLeft } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const Results = () => {
  const [season, setSeason] = useState('2023/2024');
  const [semester, setSemester] = useState('First');
  const printableRef = useRef(null);
  
  // Student information
  const studentInfo = {
    name: "Victor NOEL",
    regNo: "18/50770D/6",
    department: "Science Education",
    program: "Full Time",
    level: "600 Level",
  };

  // Mock data for different semesters and seasons
  const resultsData = {
    '2023/2024': {
      'First': [
        { courseCode: 'CS511', courseTitle: 'Design And Analysis Of Algorithm', creditUnit: 3, grade: 'C', gradePoint: 3.0 },
        { courseCode: 'CS512', courseTitle: 'Compiler Construction', creditUnit: 3, grade: 'C', gradePoint: 3.0 },
        { courseCode: 'CS513', courseTitle: 'Fundamentals Of Software Engineering', creditUnit: 3, grade: 'C', gradePoint: 3.0 },
        { courseCode: 'CS515', courseTitle: 'Advanced Computer Programming', creditUnit: 3, grade: 'C', gradePoint: 3.0 },
        { courseCode: 'EDU571', courseTitle: 'Educational Administration And Planning', creditUnit: 3, grade: 'B', gradePoint: 4.0 },
        { courseCode: 'EDU581', courseTitle: 'Measurement And Evaluation', creditUnit: 3, grade: 'C', gradePoint: 3.0 },
        { courseCode: 'SIWES', courseTitle: 'Students Industrial Work Experience Scheme', creditUnit: 8, grade: 'A', gradePoint: 5.0 },
      ],
      'Second': [
        { courseCode: 'CSC102', courseTitle: 'Introduction to Problem Solving', creditUnit: 3, grade: 'A', gradePoint: 5 * 3 },
        { courseCode: 'MTH102', courseTitle: 'Elementary Mathematics II', creditUnit: 3, grade: 'B', gradePoint: 4 * 3 },
        { courseCode: 'PHY102', courseTitle: 'General Physics II', creditUnit: 3, grade: 'B', gradePoint: 4 * 3 },
        { courseCode: 'CHM102', courseTitle: 'General Chemistry II', creditUnit: 3, grade: 'A', gradePoint: 5 * 3 },
        { courseCode: 'GST102', courseTitle: 'Use of Library', creditUnit: 2, grade: 'A', gradePoint: 5 * 2 },
      ]
    },
    '2022/2023': {
      'First': [
        { courseCode: 'CSC201', courseTitle: 'Computer Programming I', creditUnit: 3, grade: 'B', gradePoint: 4 * 3 },
        { courseCode: 'MTH201', courseTitle: 'Mathematical Methods', creditUnit: 3, grade: 'C', gradePoint: 3 * 3 },
        { courseCode: 'STA201', courseTitle: 'Statistics for Sciences', creditUnit: 3, grade: 'B', gradePoint: 4 * 3 },
        { courseCode: 'GST201', courseTitle: 'Philosophy and Logic', creditUnit: 2, grade: 'A', gradePoint: 5 * 2 },
      ],
      'Second': [
        { courseCode: 'CSC202', courseTitle: 'Computer Programming II', creditUnit: 3, grade: 'A', gradePoint: 5 * 3 },
        { courseCode: 'MTH202', courseTitle: 'Linear Algebra', creditUnit: 3, grade: 'B', gradePoint: 4 * 3 },
        { courseCode: 'STA202', courseTitle: 'Probability Theory', creditUnit: 3, grade: 'A', gradePoint: 5 * 3 },
        { courseCode: 'GST202', courseTitle: 'Nigerian Peoples and Culture', creditUnit: 2, grade: 'B', gradePoint: 4 * 2 },
      ]
    }
  };

  // Calculate metrics
  const currentResults = resultsData[season]?.[semester] || [];
  const totalCreditUnits = currentResults.reduce((total, course) => total + course.creditUnit, 0);
  const totalGradePoints = currentResults.reduce((total, course) => total + course.gradePoint, 0);
  const gpa = totalCreditUnits > 0 ? (totalGradePoints / totalCreditUnits).toFixed(2) : '0.00';

  // Summary metrics (like in the image)
  const summaryMetrics = {
    current: {
      CUR: 26,
      CUE: 26,
      WGP: 97,
      GPA: 3.73
    },
    previous: {
      TCUR: 90,
      TCUE: 90,
      TWGP: 342,
      TCGPA: 3.8
    },
    cumulative: {
      TCUR: 116,
      TCUE: 116,
      TWGP: 439,
      TCGPA: 3.78
    }
  };

  // Function to handle PDF download
  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: `Results_${studentInfo.regNo}_${season}_${semester}`,
  });

  // Function to determine honors classification based on GPA
  const getHonorsClass = (gpaValue) => {
    const numGpa = parseFloat(gpaValue);
    if (numGpa >= 4.50) return 'First Class Honors';
    if (numGpa >= 3.50) return 'Second Class Honors (Upper Division)';
    if (numGpa >= 2.40) return 'Second Class Honors (Lower Division)';
    if (numGpa >= 1.50) return 'Third Class Honors';
    if (numGpa >= 1.00) return 'Pass';
    return 'Fail';
  };

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Results</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Academic Session</label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2022/2023">2022/2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First">First Semester</SelectItem>
                  <SelectItem value="Second">Second Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Results Card */}
          <Card className="mb-6 print:shadow-none">
            <CardHeader className="bg-gray-50 border-b print:hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>Results for {semester} Semester, {season} Session</CardTitle>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-1 h-4 w-4" /> Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Download className="mr-1 h-4 w-4" /> Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {/* Printable Content */}
            <div ref={printableRef} className="p-4">
              {/* Student Information - Only visible when printing */}
              <div className="hidden print:block mb-6 border-b pb-4">
                <div className="text-center mb-4">
                  <h1 className="text-xl font-bold">STUDENT RESULT STATEMENT</h1>
                  <h2 className="font-semibold">{semester} Semester, {season} Academic Session</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="font-semibold">Student Name:</span> {studentInfo.name}</p>
                    <p><span className="font-semibold">Registration No:</span> {studentInfo.regNo}</p>
                    <p><span className="font-semibold">Department:</span> {studentInfo.department}</p>
                  </div>
                  <div>
                    <p><span className="font-semibold">Programme:</span> {studentInfo.program}</p>
                    <p><span className="font-semibold">Level:</span> {studentInfo.level}</p>
                  </div>
                </div>
              </div>
              
              {/* Summary Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-lg">Courses offered</h3>
                    <p className="text-3xl font-bold">{currentResults.length}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-lg">G.P.A</h3>
                    <p className="text-3xl font-bold">{gpa}</p>
                  </div>
                </div>
              </div>
    
              {currentResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="border border-collapse">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-left">Course Code & Title</TableHead>
                        <TableHead className="text-center w-20">Credit</TableHead>
                        <TableHead className="text-center w-20">Grade</TableHead>
                        <TableHead className="text-center w-20">GP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentResults.map((course, index) => (
                        <TableRow key={index} className="border-b">
                          <TableCell>
                            <div className="font-medium">{course.courseCode}</div>
                            <div className="text-gray-600">{course.courseTitle}</div>
                          </TableCell>
                          <TableCell className="text-center">{course.creditUnit}</TableCell>
                          <TableCell className={`text-center font-medium ${
                            course.grade === 'A' ? 'text-green-600' : 
                            course.grade === 'F' ? 'text-red-600' : ''
                          }`}>
                            {course.grade}
                          </TableCell>
                          <TableCell className="text-center">{course.gradePoint.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Remarks and Summary */}
                  <div className="mt-8">
                    <p className="mb-4"><span className="font-bold">Remarks:</span> {parseFloat(gpa) >= 1.0 ? 'Pass' : 'Fail'}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <h4 className="font-bold mb-2">Current</h4>
                        <p>CUR: {summaryMetrics.current.CUR}</p>
                        <p>CUE: {summaryMetrics.current.CUE}</p>
                        <p>WGP: {summaryMetrics.current.WGP}</p>
                        <p>GPA: {summaryMetrics.current.GPA}</p>
                      </div>
                      <div>
                        <h4 className="font-bold mb-2">Previous</h4>
                        <p>TCUR: {summaryMetrics.previous.TCUR}</p>
                        <p>TCUE: {summaryMetrics.previous.TCUE}</p>
                        <p>TWGP: {summaryMetrics.previous.TWGP}</p>
                        <p>TCGPA: {summaryMetrics.previous.TCGPA}</p>
                      </div>
                      <div>
                        <h4 className="font-bold mb-2">Cumulative</h4>
                        <p>TCUR: {summaryMetrics.cumulative.TCUR}</p>
                        <p>TCUE: {summaryMetrics.cumulative.TCUE}</p>
                        <p>TWGP: {summaryMetrics.cumulative.TWGP}</p>
                        <p>TCGPA: {summaryMetrics.cumulative.TCGPA}</p>
                      </div>
                    </div>
                    
                    <div className="print:flex print:justify-between mt-8 print:pt-4 print:border-t hidden">
                      <Button variant="outline" size="sm" className="print:visible">
                        <ChevronLeft className="mr-1 h-4 w-4" /> Back
                      </Button>
                      <Button size="sm" className="print:visible">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No Results Available</h3>
                  <p className="text-gray-500 mt-2">
                    There are no results available for the selected semester and session.
                  </p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Academic Performance Chart */}
          <div className="print:hidden">
            <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
            <AcademicPerformance />
          </div>
        </div>
      </div>
    </>
  );
};

export default Results;
