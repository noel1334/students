import React, { useState } from 'react';
import { Printer, Check, Edit } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import CourseCard from '@/components/CourseCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Courses = () => {
  const [session, setSession] = useState('2024/2025');
  const [semester, setSemester] = useState('First Semester');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationConfirm, setShowRegistrationConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Sample courses data
  const courses = [
    { code: 'SIWES', title: 'Students\' Industrial Work Experience Scheme', units: 8, isElective: false, isCarryOver: false },
    { code: 'CS511', title: 'Design and Analysis of Algorithm', units: 3, isElective: false, isCarryOver: false },
    { code: 'CS512', title: 'Compiler Construction', units: 3, isElective: false, isCarryOver: false },
    { code: 'CS513', title: 'Fundamentals of Software Engineering', units: 3, isElective: false, isCarryOver: false },
    { code: 'CS515', title: 'Advanced Computer Programming', units: 3, isElective: false, isCarryOver: false },
    { code: 'EDU571', title: 'Educational administration and planning', units: 3, isElective: true, isCarryOver: false },
    { code: 'EDU581', title: 'Measurement and evaluation', units: 3, isElective: true, isCarryOver: false },
  ];

  const handleCourseSelect = (courseCode: string) => {
    setSelectedCourses(prev => {
      // If already selected, remove it
      if (prev.includes(courseCode)) {
        return prev.filter(code => code !== courseCode);
      }
      
      // Add the course
      const newSelected = [...prev, courseCode];
      
      // Check if we need to auto-select non-electives
      const selectedCourse = courses.find(c => c.code === courseCode);
      
      // If an elective or carryover was selected, auto-select all non-electives
      if (selectedCourse?.isElective || selectedCourse?.isCarryOver) {
        const nonElectiveCodes = courses
          .filter(c => !c.isElective && !c.isCarryOver)
          .map(c => c.code);
          
        // Add all non-electives that aren't already selected
        nonElectiveCodes.forEach(code => {
          if (!newSelected.includes(code)) {
            newSelected.push(code);
          }
        });
      }
      
      return newSelected;
    });
  };

  const handleRegister = () => {
    setShowRegistrationConfirm(true);
  };

  const handleConfirmRegistration = () => {
    setIsRegistered(true);
    setShowRegistrationConfirm(false);
  };

  const handleCancelRegistration = () => {
    setShowRegistrationConfirm(false);
  };

  const handleEditRegistration = () => {
    setIsEditing(true);
    setIsRegistered(false);
    // Pre-populate selected courses with all courses when editing
    setSelectedCourses(courses.map(course => course.code));
  };

  const handleUpdateRegistration = () => {
    setIsRegistered(true);
    setIsEditing(false);
  };

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-1">Courses</h1>
            {!isRegistered && (
              <div className="text-sm text-gray-500">
                <p>2024/25</p>
                <p className="font-medium text-gray-800">600 Level</p>
                <p>{semester}</p>
              </div>
            )}
          </div>
          
          {isRegistered ? (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div>
                    <div className="mb-2">
                      <Select value={session} onValueChange={setSession}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023/2024">2023/2024</SelectItem>
                          <SelectItem value="2024/2025">2024/2025</SelectItem>
                          <SelectItem value="2025/2026">2025/2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select value={semester} onValueChange={setSemester}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First Semester">First Semester</SelectItem>
                          <SelectItem value="Second Semester">Second Semester</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-blue-700 hover:bg-blue-800">
                      <Printer className="mr-2 h-4 w-4" /> Download Course Form
                    </Button>
                    <Button variant="outline" className="border-gray-300">
                      Generate Exam Card
                    </Button>
                    <Button 
                      onClick={handleEditRegistration}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit Registration
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {courses.map(course => (
                    <CourseCard 
                      key={course.code}
                      code={course.code}
                      title={course.title}
                      units={course.units}
                      isSelected={true}
                      onSelect={() => {}}
                      isRegistered={true}
                      isElective={course.isElective}
                      isCarryOver={course.isCarryOver}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div>
                    <div className="mb-2">
                      <Select value={session} onValueChange={setSession}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023/2024">2023/2024</SelectItem>
                          <SelectItem value="2024/2025">2024/2025</SelectItem>
                          <SelectItem value="2025/2026">2025/2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select value={semester} onValueChange={setSemester}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First Semester">First Semester</SelectItem>
                          <SelectItem value="Second Semester">Second Semester</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {courses.map(course => (
                    <CourseCard 
                      key={course.code}
                      code={course.code}
                      title={course.title}
                      units={course.units}
                      isSelected={selectedCourses.includes(course.code)}
                      onSelect={() => handleCourseSelect(course.code)}
                      isElective={course.isElective}
                      isCarryOver={course.isCarryOver}
                      isRegistered={false}
                    />
                  ))}
                </div>
                
                {selectedCourses.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <Button 
                      className="bg-blue-700 hover:bg-blue-800 w-full md:w-auto md:px-12"
                      onClick={isEditing ? handleUpdateRegistration : handleRegister}
                    >
                      {isEditing ? 'Update Course Registration' : 'Register Selected Courses'}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Registration confirmation dialog */}
          <Dialog open={showRegistrationConfirm} onOpenChange={setShowRegistrationConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Course Registration</DialogTitle>
                <DialogDescription>
                  You are about to register {selectedCourses.length} courses for {session} {semester}.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="my-4 max-h-[300px] overflow-y-auto">
                {courses
                  .filter(course => selectedCourses.includes(course.code))
                  .map(course => (
                    <div key={course.code} className="mb-2 flex justify-between">
                      <div>
                        <p className="font-medium">{course.code}</p>
                        <p className="text-sm text-gray-600">{course.title}</p>
                      </div>
                      <p className="text-sm">{course.units} units</p>
                    </div>
                  ))
                }
              </div>
              <DialogFooter className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleCancelRegistration}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={handleConfirmRegistration}
                >
                  Submit Course Registration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Courses;
