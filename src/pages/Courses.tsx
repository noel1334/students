
import React, { useState, useEffect } from 'react';
import { Printer, Check, Edit } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import CourseCard from '@/components/CourseCard';
import { useToast } from '@/hooks/use-toast';
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
import { getMyRegistrableCourses, registerForCourses, getMyRegistrations, Course, CourseRegistration } from '@/services/courseApi';

const Courses = () => {
  const [session, setSession] = useState('2024/2025');
  const [semester, setSemester] = useState('First Semester');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationConfirm, setShowRegistrationConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch registrable courses
  const { data: registrableCoursesData, isLoading: isLoadingCourses, error: coursesError } = useQuery({
    queryKey: ['registrable-courses'],
    queryFn: getMyRegistrableCourses,
  });

  // Fetch current registrations
  const { data: registrationsData, isLoading: isLoadingRegistrations } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: getMyRegistrations,
  });

  // Course registration mutation
  const registerMutation = useMutation({
    mutationFn: registerForCourses,
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: `Successfully registered for ${selectedCourses.length} courses.`,
      });
      setIsRegistered(true);
      setShowRegistrationConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error?.response?.data?.message || "Failed to register for courses. Please try again.",
        variant: "destructive",
      });
    },
  });

  const courses = registrableCoursesData?.data?.courses || [];
  const registrations = registrationsData?.data?.registrations || [];

  // Check if user has existing registrations
  useEffect(() => {
    if (registrations.length > 0) {
      setIsRegistered(true);
    }
  }, [registrations]);

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
    const selectedCourseIds = courses
      .filter(course => selectedCourses.includes(course.code))
      .map(course => course.id);
    
    registerMutation.mutate(selectedCourseIds);
  };

  const handleCancelRegistration = () => {
    setShowRegistrationConfirm(false);
  };

  const handleEditRegistration = () => {
    setIsEditing(true);
    setIsRegistered(false);
    // Pre-populate selected courses with registered courses
    const registeredCourses = registrations.map(reg => reg.course.code);
    setSelectedCourses(registeredCourses);
  };

  const handleUpdateRegistration = () => {
    const selectedCourseIds = courses
      .filter(course => selectedCourses.includes(course.code))
      .map(course => course.id);
    
    registerMutation.mutate(selectedCourseIds);
  };

  if (isLoadingCourses || isLoadingRegistrations) {
    return (
      <>
        <DashboardHeader />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading courses...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (coursesError) {
    return (
      <>
        <DashboardHeader />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600">Failed to load courses. Please try again.</p>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['registrable-courses'] })}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Use registered courses if user has registrations, otherwise use registrable courses
  const displayCourses = isRegistered ? registrations.map(reg => reg.course) : courses;

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
                  {displayCourses.map(course => (
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
                  {displayCourses.map(course => (
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
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending 
                        ? 'Processing...' 
                        : (isEditing ? 'Update Course Registration' : 'Register Selected Courses')
                      }
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
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Registering...' : 'Submit Course Registration'}
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
