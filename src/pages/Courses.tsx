
import React, { useState, useEffect } from 'react';
import { Printer, Check, Edit } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getRegistrableCourses, 
  getAllLevels, 
  registerForCourses, 
  getMyRegistrations,
  type RegistrableCourse 
} from '@/services/courseApiService';
import { getAllSeasons, getAllSemesters, type Season, type Semester } from '@/services/academicPeriodsApiService';

const Courses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize with user's current values from landing page data
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(
    user?.currentSeasonId ? parseInt(user.currentSeasonId) : null
  );
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(
    user?.currentSemesterId ? parseInt(user.currentSemesterId) : null
  );
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(
    user?.currentLevelId ? parseInt(user.currentLevelId) : null
  );
  
  // UI state
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [showRegistrationConfirm, setShowRegistrationConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Update state when user data becomes available
  useEffect(() => {
    if (user && !selectedSeasonId && user.currentSeasonId) {
      setSelectedSeasonId(parseInt(user.currentSeasonId));
    }
    if (user && !selectedSemesterId && user.currentSemesterId) {
      setSelectedSemesterId(parseInt(user.currentSemesterId));
    }
    if (user && !selectedLevelId && user.currentLevelId) {
      setSelectedLevelId(parseInt(user.currentLevelId));
    }
  }, [user, selectedSeasonId, selectedSemesterId, selectedLevelId]);

  // Fetch seasons
  const { data: seasonsData, isLoading: seasonsLoading } = useQuery({
    queryKey: ['seasons'],
    queryFn: getAllSeasons,
  });

  // Fetch semesters based on selected season
  const { data: semestersData, isLoading: semestersLoading } = useQuery({
    queryKey: ['semesters', selectedSeasonId],
    queryFn: () => getAllSemesters(selectedSeasonId || undefined),
    enabled: !!selectedSeasonId,
  });

  // Fetch levels
  const { data: levelsData, isLoading: levelsLoading } = useQuery({
    queryKey: ['levels'],
    queryFn: getAllLevels,
  });

  // Fetch registrable courses - only when all required filters are selected
  const { 
    data: coursesData, 
    isLoading: coursesLoading, 
    error: coursesError 
  } = useQuery({
    queryKey: ['registrable-courses', selectedSeasonId, selectedSemesterId, selectedLevelId],
    queryFn: () => getRegistrableCourses(selectedSeasonId!, selectedSemesterId!, selectedLevelId!),
    enabled: !!selectedSeasonId && !!selectedSemesterId && !!selectedLevelId,
  });

  // Fetch current registrations
  const { data: registrationsData, isLoading: registrationsLoading } = useQuery({
    queryKey: ['my-registrations', selectedSeasonId, selectedSemesterId],
    queryFn: () => getMyRegistrations(selectedSeasonId!, selectedSemesterId!),
    enabled: !!selectedSeasonId && !!selectedSemesterId,
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: registerForCourses,
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Your courses have been registered successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      setShowRegistrationConfirm(false);
      setSelectedCourses([]);
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Failed to register courses",
        variant: "destructive",
      });
    },
  });

  // Get data arrays with fallbacks
  const seasons = seasonsData?.data?.items || [];
  const semesters = semestersData?.data?.items || [];
  const levels = levelsData?.data?.items || [];
  const courses = coursesData?.data?.availableCourses || [];

  // Get current registration status
  const isRegistered = registrationsData?.data?.items && registrationsData.data.items.length > 0;
  const registeredCourseIds = registrationsData?.data?.items?.map(reg => reg.courseId) || [];

  // Get selected items for display
  const selectedSeason = seasons.find(s => s.id === selectedSeasonId);
  const selectedSemester = semesters.find(s => s.id === selectedSemesterId);
  const selectedLevel = levels.find(l => l.id === selectedLevelId);

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const handleRegister = () => {
    setShowRegistrationConfirm(true);
  };

  const handleConfirmRegistration = () => {
    if (!selectedSeasonId || !selectedSemesterId || !selectedLevelId) {
      toast({
        title: "Missing information",
        description: "Please select season, semester, and level",
        variant: "destructive",
      });
      return;
    }

    const registrations = selectedCourses.map(courseId => {
      const course = courses.find(c => c.id === courseId);
      return {
        courseId,
        seasonId: selectedSeasonId,
        semesterId: selectedSemesterId,
        levelId: selectedLevelId,
        programCourseId: course?.programCourseId || undefined,
      };
    });

    registerMutation.mutate(registrations);
  };

  const handleEditRegistration = () => {
    setIsEditing(true);
    setSelectedCourses(registeredCourseIds);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedCourses([]);
  };

  if (coursesLoading || seasonsLoading || levelsLoading) {
    return (
      <>
        <DashboardHeader />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-8">Loading courses...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-1">Courses</h1>
            <div className="text-sm text-gray-500">
              <p>{selectedSeason?.name || user?.currentSeasonName || 'No Season Selected'}</p>
              <p className="font-medium text-gray-800">{selectedLevel?.name || user?.currentLevelName || 'No Level Selected'}</p>
              <p>{selectedSemester?.name || user?.currentSemesterName || 'No Semester Selected'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Season</label>
                  <Select 
                    value={selectedSeasonId?.toString() || ''} 
                    onValueChange={(value) => {
                      setSelectedSeasonId(parseInt(value));
                      setSelectedSemesterId(null);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder={user?.currentSeasonName || "Select season"} />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map(season => (
                        <SelectItem key={season.id} value={season.id.toString()}>
                          {season.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Semester</label>
                  <Select 
                    value={selectedSemesterId?.toString() || ''} 
                    onValueChange={(value) => setSelectedSemesterId(parseInt(value))}
                    disabled={!selectedSeasonId || semestersLoading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={user?.currentSemesterName || "Select semester"} />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map(semester => (
                        <SelectItem key={semester.id} value={semester.id.toString()}>
                          {semester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Level</label>
                  <Select 
                    value={selectedLevelId?.toString() || ''} 
                    onValueChange={(value) => setSelectedLevelId(parseInt(value))}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={user?.currentLevelName || "Select level"} />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isRegistered && !isEditing && (
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
              )}

              {isEditing && (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Course List */}
            {coursesError && (
              <div className="text-red-600 mb-4">
                Error loading courses. Please try again.
              </div>
            )}

            {!selectedSeasonId || !selectedSemesterId || !selectedLevelId ? (
              <div className="text-center py-8 text-gray-500">
                Please select season, semester, and level to view available courses.
              </div>
            ) : courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map(course => (
                  <CourseCard 
                    key={course.id}
                    code={course.code}
                    title={course.title}
                    units={course.creditUnit}
                    isSelected={isRegistered && !isEditing ? registeredCourseIds.includes(course.id) : selectedCourses.includes(course.id)}
                    onSelect={() => !isRegistered || isEditing ? handleCourseSelect(course.id) : undefined}
                    isRegistered={isRegistered && !isEditing}
                    isElective={course.isElective}
                    isCarryOver={course.offeringReason === 'Carryover'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No courses available for the selected period.
              </div>
            )}
            
            {/* Registration Button */}
            {(!isRegistered || isEditing) && selectedCourses.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button 
                  className="bg-blue-700 hover:bg-blue-800 w-full md:w-auto md:px-12"
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending 
                    ? 'Processing...' 
                    : isEditing 
                      ? 'Update Course Registration' 
                      : 'Register Selected Courses'
                  }
                </Button>
              </div>
            )}
          </div>
          
          {/* Registration confirmation dialog */}
          <Dialog open={showRegistrationConfirm} onOpenChange={setShowRegistrationConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Course Registration</DialogTitle>
                <DialogDescription>
                  You are about to register {selectedCourses.length} courses for {selectedSeason?.name} {selectedSemester?.name}.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="my-4 max-h-[300px] overflow-y-auto">
                {courses
                  .filter(course => selectedCourses.includes(course.id))
                  .map(course => (
                    <div key={course.id} className="mb-2 flex justify-between">
                      <div>
                        <p className="font-medium">{course.code}</p>
                        <p className="text-sm text-gray-600">{course.title}</p>
                      </div>
                      <p className="text-sm">{course.creditUnit} units</p>
                    </div>
                  ))
                }
              </div>
              <DialogFooter className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRegistrationConfirm(false)}
                  disabled={registerMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={handleConfirmRegistration}
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Processing...' : 'Submit Course Registration'}
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
