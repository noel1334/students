
import React, { useState } from 'react';
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
import { Download, Printer, FileText } from 'lucide-react';

const Results = () => {
  const [season, setSeason] = useState('2023/2024');
  const [semester, setSemester] = useState('First');

  // Mock data for different semesters and seasons
  const resultsData = {
    '2023/2024': {
      'First': [
        { courseCode: 'CSC101', courseTitle: 'Introduction to Computer Science', creditUnit: 3, grade: 'A', gradePoint: 5 * 3 },
        { courseCode: 'MTH101', courseTitle: 'Elementary Mathematics I', creditUnit: 3, grade: 'B', gradePoint: 4 * 3 },
        { courseCode: 'PHY101', courseTitle: 'General Physics I', creditUnit: 3, grade: 'A', gradePoint: 5 * 3 },
        { courseCode: 'CHM101', courseTitle: 'General Chemistry I', creditUnit: 3, grade: 'C', gradePoint: 3 * 3 },
        { courseCode: 'GST101', courseTitle: 'Communication in English', creditUnit: 2, grade: 'B', gradePoint: 4 * 2 },
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

  // Calculate the total credit units, grade points, and GPA
  const currentResults = resultsData[season]?.[semester] || [];
  const totalCreditUnits = currentResults.reduce((total, course) => total + course.creditUnit, 0);
  const totalGradePoints = currentResults.reduce((total, course) => total + course.gradePoint, 0);
  const gpa = totalCreditUnits > 0 ? (totalGradePoints / totalCreditUnits).toFixed(2) : '0.00';

  // Function to determine honors classification based on GPA
  const getHonorsClass = (gpa) => {
    const numGpa = parseFloat(gpa);
    if (numGpa >= 4.50) return 'First Class Honors';
    if (numGpa >= 3.50) return 'Second Class Honors (Upper Division)';
    if (numGpa >= 2.40) return 'Second Class Honors (Lower Division)';
    if (numGpa >= 1.50) return 'Third Class Honors';
    if (numGpa >= 1.00) return 'Pass';
    return 'Fail';
  };

  // Function to handle PDF download (mock implementation)
  const handleDownloadPDF = () => {
    // In a real implementation, this would generate a PDF file
    alert('Downloading results as PDF...');
  };

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Results</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Academic Session</label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>Results for {semester} Semester, {season} Session</CardTitle>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                    <Download className="mr-1 h-4 w-4" /> Download PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-1 h-4 w-4" /> Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {currentResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead className="hidden md:table-cell">Course Title</TableHead>
                        <TableHead>Credit Unit</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Grade Point</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentResults.map((course, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{course.courseCode}</TableCell>
                          <TableCell className="hidden md:table-cell">{course.courseTitle}</TableCell>
                          <TableCell>{course.creditUnit}</TableCell>
                          <TableCell className={`font-semibold ${course.grade === 'A' ? 'text-green-600' : course.grade === 'F' ? 'text-red-600' : ''}`}>
                            {course.grade}
                          </TableCell>
                          <TableCell>{course.gradePoint}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption className="pt-4">
                      <div className="text-right space-y-1">
                        <p><span className="font-medium">Total Credit Units:</span> {totalCreditUnits}</p>
                        <p><span className="font-medium">Total Grade Points:</span> {totalGradePoints}</p>
                        <p className="text-lg"><span className="font-semibold">GPA:</span> <span className="font-bold">{gpa}</span></p>
                        <p className="text-md"><span className="font-semibold">Classification:</span> <span className="font-bold">{getHonorsClass(gpa)}</span></p>
                      </div>
                    </TableCaption>
                  </Table>
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
            </CardContent>
          </Card>
          
          {/* Academic Performance Chart */}
          <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
          <AcademicPerformance />
        </div>
      </div>
    </>
  );
};

export default Results;
