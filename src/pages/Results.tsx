import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AcademicPerformance from '@/components/AcademicPerformance';
import { Download, Printer, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getStudentResultHistory, 
  getResultById, 
  ResultMinimal, 
  ResultDetail 
} from '@/services/resultApiService';
import { toast } from 'sonner';

const Results = () => {
  const { user } = useAuth();
  const [availableResults, setAvailableResults] = useState<ResultMinimal[]>([]);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);
  const [resultDetail, setResultDetail] = useState<ResultDetail | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const printableRef = useRef(null);

 // Fetch available results on mount
  useEffect(() => {
    const fetchResultHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await getStudentResultHistory();
        console.log('Result history response:', response);

        if (response.status === 'success') {
          // CORRECTLY ACCESS THE NESTED 'history' ARRAY
          const resultsArray = response.data?.history || [];

          setAvailableResults(resultsArray);

          // Auto-select the most recent result
          if (resultsArray.length > 0) {
            setSelectedResultId(resultsArray[0].id);
          }
        }
      } catch (error: any) {
        console.error('Error fetching result history:', error);
        toast.error(error.response?.data?.message || 'Failed to load result history');
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchResultHistory();
  }, []);

  // Fetch result detail when selection changes
useEffect(() => {
    if (selectedResultId === null) return;

    const fetchResultDetail = async () => {
      try {
        setIsLoadingDetail(true);
        // The API service already unwraps the first 'data' layer for you
        const apiResponse = await getResultById(selectedResultId); 
        
        // The controller wraps the actual data in another object, e.g., { data: { result: ... } }
        // Let's assume your getResultById service returns the full API response.
        // If your service returns response.data, then you might need apiResponse.result
        if (apiResponse.status === 'success' && apiResponse.data) {
          // The key is to access the 'result' property inside 'data'
          setResultDetail(apiResponse.data.result); 
        }
      } catch (error: any) {
        console.error('Error fetching result detail:', error);
        toast.error(error.response?.data?.message || 'Failed to load result details');
        setResultDetail(null); // Clear previous result on error
      } finally {
        setIsLoadingDetail(false);
      }
    };

    fetchResultDetail();
  }, [selectedResultId]);

   const totalQualityPoints = useMemo(() => {
    if (!resultDetail?.courseScores) {
      return 0;
    }
    // Use reduce to sum up all the weightedPoint values
    return resultDetail.courseScores.reduce(
      (sum, course) => sum + course.weightedPoint,
      0
    );
  }, [resultDetail]); // This will only recalculate when resultDetail changes

  // Function to handle PDF download/print
   const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    // Use optional chaining for each nested property
    documentTitle: `Results_${resultDetail?.student?.regNo}_${resultDetail?.season?.name}_${resultDetail?.semester?.name}`,
  });

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-auto bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Results</h1>

        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Result</label>
            {isLoadingHistory ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedResultId?.toString() || ''}
                onValueChange={(value) => setSelectedResultId(Number(value))}
                disabled={!Array.isArray(availableResults) || availableResults.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a semester result" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(availableResults) && availableResults.length > 0 ? (
                    availableResults.map((result) => (
                      <SelectItem key={result.id} value={result.id.toString()}>
                        {result.seasonName} - {result.semesterName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No results available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Results Card */}
        <Card className="mb-6 print:shadow-none">
          <CardHeader className="bg-muted/50 border-b print:hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-base sm:text-lg">
                {resultDetail
                  ? `${resultDetail.season.name} - ${resultDetail.semester.name}`
                  : 'Result Details'}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  disabled={!resultDetail || isLoadingDetail}
                >
                  <Printer className="mr-1 h-4 w-4" /> Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  disabled={!resultDetail || isLoadingDetail}
                >
                  <Download className="mr-1 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Printable Content */}
          <div ref={printableRef} className="p-4 sm:p-6">
            {isLoadingDetail ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : !resultDetail ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Result Selected</h3>
                <p className="text-muted-foreground mt-2">
                  {Array.isArray(availableResults) && availableResults.length === 0
                    ? 'No results available yet. Check back later.'
                    : 'Select a semester from the dropdown above to view results.'}
                </p>
              </div>
            ) : (
              <>
                {/* Student Information */}
                <div className="hidden print:block mb-6 border-b pb-4">
                  <div className="text-center mb-4">
                    <h1 className="text-xl font-bold">STUDENT RESULT STATEMENT</h1>
                    <h2 className="font-semibold">
                      {resultDetail.season.name} - {resultDetail.semester.name}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-semibold">Student Name:</span> {resultDetail.student.name}</p>
                      <p><span className="font-semibold">Registration No:</span> {resultDetail.student.regNo}</p>
                      <p><span className="font-semibold">Department:</span> {resultDetail.department?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Programme:</span> {resultDetail.program?.name || 'N/A'}</p>
                      <p><span className="font-semibold">Level:</span> {resultDetail.level?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Summary Statistics */}
                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Courses</h3>
                      <p className="text-2xl sm:text-3xl font-bold">{resultDetail.courseScores.length}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">G.P.A</h3>
                      <p className="text-2xl sm:text-3xl font-bold">{resultDetail.gpa.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">C.G.P.A</h3>
                      <p className="text-2xl sm:text-3xl font-bold">{resultDetail.cgpa.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
                      <p className="text-xl sm:text-2xl font-bold capitalize">{resultDetail.remarks}</p>
                    </div>
                  </div>
                </div>

                {/* Course Table */}
                {resultDetail.courseScores.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table className="border border-collapse">
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-left">Course</TableHead>
                          <TableHead className="text-center w-16 sm:w-20">Credit</TableHead>
                          <TableHead className="text-center w-16 sm:w-20 hidden sm:table-cell">CA</TableHead>
                          <TableHead className="text-center w-16 sm:w-20 hidden sm:table-cell">Exam</TableHead>
                          <TableHead className="text-center w-16 sm:w-20">Total</TableHead>
                          <TableHead className="text-center w-16 sm:w-20">Grade</TableHead>
                          <TableHead className="text-center w-16 sm:w-20 hidden md:table-cell">GP</TableHead>
                          <TableHead className="text-center w-16 sm:w-20">QP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultDetail.courseScores.map((course, index) => (
                          <TableRow key={index} className="border-b">
                            <TableCell>
                              <div className="font-medium text-sm">{course.courseCode}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-none">
                                {course.courseTitle}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{course.credit}</TableCell>
                            <TableCell className="text-center hidden sm:table-cell">{course.CA}</TableCell>
                            <TableCell className="text-center hidden sm:table-cell">{course.exam}</TableCell>
                            <TableCell className="text-center">{course.total}</TableCell>
                            <TableCell
                              className={`text-center font-medium ${
                                course.grade === 'A'
                                  ? 'text-green-600'
                                  : course.grade === 'F'
                                  ? 'text-destructive'
                                  : ''
                              }`}
                            >
                              {course.grade}
                            </TableCell>
                            <TableCell className="text-center hidden md:table-cell">
                              {course.gradePoint.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-center">{course.weightedPoint.toFixed(1)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Detailed Summary */}
                    <div className="mt-6 sm:mt-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-bold mb-2">Current Semester</h4>
                          <div className="space-y-1">
                            <p>Credit Units Registered: <span className="font-semibold">{resultDetail.cuAttempted}</span></p>
                            <p>Credit Units Earned: <span className="font-semibold">{resultDetail.cuPassed}</span></p>
                            {/* --- ADD THIS LINE TO DISPLAY THE SUM --- */}
                            <p>Total Quality Points: <span className="font-semibold">{totalQualityPoints.toFixed(2)}</span></p>
                            <p>GPA: <span className="font-semibold">{resultDetail.gpa.toFixed(2)}</span></p>
                          </div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-bold mb-2">Cumulative</h4>
                          <div className="space-y-1">
                            <p>Total Credit Units: <span className="font-semibold">{resultDetail.cuTotal}</span></p>
                            <p>CGPA: <span className="font-semibold">{resultDetail.cgpa.toFixed(2)}</span></p>
                            <p>Remark: <span className="font-semibold capitalize">{resultDetail.remarks}</span></p>
                          </div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg sm:col-span-2 lg:col-span-1">
                          <h4 className="font-bold mb-2">Classification</h4>
                          <div className="space-y-1">
                            <p className="text-base font-semibold">
                              {resultDetail.cgpa >= 4.5
                                ? 'First Class'
                                : resultDetail.cgpa >= 3.5
                                ? 'Second Class Upper'
                                : resultDetail.cgpa >= 2.4
                                ? 'Second Class Lower'
                                : resultDetail.cgpa >= 1.5
                                ? 'Third Class'
                                : 'Pass'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Course Scores</h3>
                    <p className="text-muted-foreground mt-2">
                      No course scores found for this result.
                    </p>
                  </div>
                )}
              </>
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
  );
};

export default Results;
