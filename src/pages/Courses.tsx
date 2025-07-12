
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from '@/components/DashboardHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
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

// Import refactored components
import CoursesHeader from '@/components/courses/CoursesHeader';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseActions from '@/components/courses/CourseActions';
import RegisteredCoursesList from '@/components/courses/RegisteredCoursesList';
import AvailableCoursesList from '@/components/courses/AvailableCoursesList';

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
  const seasons = seasonsData?.data?.seasons || [];
  const semesters = semestersData?.data?.semesters || [];
  const levels = levelsData?.data?.items || [];
  const courses = coursesData?.data?.availableCourses || [];
  const registrations = registrationsData?.data?.items || [];

  // Get current registration status
  const isRegistered = registrations && registrations.length > 0;
  const registeredCourseIds = registrations?.map(reg => reg.course.id) || [];

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

  const handleSeasonChange = (seasonId: number) => {
    setSelectedSeasonId(seasonId);
    setSelectedSemesterId(null);
  };

  const handleSemesterChange = (semesterId: number) => {
    setSelectedSemesterId(semesterId);
  };

  const handleLevelChange = (levelId: number) => {
    setSelectedLevelId(levelId);
  };

  if (coursesLoading || seasonsLoading || levelsLoading || registrationsLoading) {
    return (
      <>
        <DashboardHeader />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
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
        <div className="max-w-6xl mx-auto">
          <CoursesHeader
            selectedSeason={selectedSeason}
            selectedSemester={selectedSemester}
            selectedLevel={selectedLevel}
            userCurrentSeasonName={user?.currentSeasonName}
            userCurrentSemesterName={user?.currentSemesterName}
            userCurrentLevelName={user?.currentLevelName}
          />

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            {/* Filters and Actions */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
              <CourseFilters
                seasons={seasons}
                semesters={semesters}
                levels={levels}
                selectedSeasonId={selectedSeasonId}
                selectedSemesterId={selectedSemesterId}
                selectedLevelId={selectedLevelId}
                onSeasonChange={handleSeasonChange}
                onSemesterChange={handleSemesterChange}
                onLevelChange={handleLevelChange}
                semestersLoading={semestersLoading}
              />
              
              <CourseActions
                isRegistered={isRegistered}
                isEditing={isEditing}
                onEditRegistration={handleEditRegistration}
                onCancelEdit={handleCancelEdit}
              />
            </div>

            {/* Error message */}
            {coursesError && (
              <div className="text-red-600 mb-4">
                Error loading courses. Please try again.
              </div>
            )}

            {!selectedSeasonId || !selectedSemesterId || !selectedLevelId ? (
              <div className="text-center py-8 text-gray-500">
                Please select season, semester, and level to view available courses.
              </div>
            ) : (
              <div className="space-y-8">
                {/* Registered Courses Section */}
                {isRegistered && !isEditing && (
                  <RegisteredCoursesList registrations={registrations} />
                )}
                
                {/* Available Courses Section */}
                {(courses.length > 0 || isEditing) && (
                  <AvailableCoursesList
                    courses={courses}
                    selectedCourses={selectedCourses}
                    registeredCourseIds={registeredCourseIds}
                    isRegistered={isRegistered}
                    isEditing={isEditing}
                    onCourseSelect={handleCourseSelect}
                    onRegister={handleRegister}
                    isRegistering={registerMutation.isPending}
                  />
                )}
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
