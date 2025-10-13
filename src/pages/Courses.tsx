// src/pages/Courses.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  registerForCourses,
  getMyRegistrations,
  deleteIndividualRegistration,
  deleteBatchRegistrations,
  updateStudentRegistrations,
  type RegistrableCourse,
  type Level,
  type CourseRegistration,
  type Season,
  type Semester,
  type DisplayCourse, // IMPORT NEW DisplayCourse interface
} from '@/services/courseApiService';
import { getAllSeasons, getAllSemesters, getAllLevels } from '@/services/academicPeriodsApiService';
import { getMySchoolFeeRecords } from '@/services/feeApiService';


// Import refactored components
import CoursesHeader from '@/components/courses/CoursesHeader';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseActions from '@/components/courses/CourseActions';
import RegisteredCoursesList from '@/components/courses/RegisteredCoursesList';
import AvailableCoursesList from '@/components/courses/AvailableCoursesList';
import CourseFormDownloader from '@/components/courses/CourseFormDownloader';

const Courses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(
    user?.currentSeasonId ? parseInt(user.currentSeasonId) : null
  );
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(
    user?.currentSemesterId ? parseInt(user.currentSemesterId) : null
  );
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(
    user?.currentLevelId ? parseInt(user.currentLevelId) : null
  );

  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [showRegistrationConfirm, setShowRegistrationConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedRegisteredCourseIds, setSelectedRegisteredCourseIds] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch payment records to check if student has paid
  const { data: paymentData } = useQuery({
    queryKey: ['paymentRecords', user?.id],
    queryFn: getMySchoolFeeRecords,
    enabled: !!user?.id,
  });

  const paymentRecords = Array.isArray(paymentData?.data?.records) ? paymentData.data.records : [];

  // Check if the current season has been fully paid
  const hasCurrentSeasonBeenPaid = useMemo(() => {
    if (!user?.currentSeasonId || !paymentRecords.length) return false;
    
    const currentSeasonRecord = paymentRecords.find(
      record => record.season.id.toString() === user.currentSeasonId
    );
    
    return currentSeasonRecord?.paymentStatus === 'PAID';
  }, [paymentRecords, user?.currentSeasonId]);

  // Redirect to payment page if not paid
  useEffect(() => {
    if (user?.currentSeasonId && paymentRecords.length > 0 && !hasCurrentSeasonBeenPaid) {
      toast({
        title: "Payment Required",
        description: "Please complete your school fees payment to access course registration.",
        variant: "destructive",
      });
      navigate('/payments');
    }
  }, [hasCurrentSeasonBeenPaid, user?.currentSeasonId, paymentRecords.length, navigate, toast]);

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


  const { data: registrationsData, isLoading: registrationsLoading } = useQuery({
    queryKey: ['my-registrations', selectedSeasonId, selectedSemesterId],
    queryFn: () => getMyRegistrations(selectedSeasonId!, selectedSemesterId!),
    enabled: !!selectedSeasonId && !!selectedSemesterId,
  });

  const registrations = Array.isArray(registrationsData?.data?.items) ? registrationsData.data.items : [];
  const isRegistered = registrations.length > 0;
  const currentlyRegisteredCourseIds = registrations?.map(reg => reg.course.id) || [];
  const currentlyRegisteredCoursesMap = new Map(registrations.map(reg => [reg.course.id, reg]));


  const { data: allSeasonsData, isLoading: allSeasonsLoading } = useQuery({
    queryKey: ['allSeasons'],
    queryFn: getAllSeasons,
    enabled: !isRegistered
  });

  const { data: allSemestersData, isLoading: allSemestersLoading } = useQuery({
    queryKey: ['allSemesters', selectedSeasonId],
    queryFn: () => getAllSemesters(selectedSeasonId || undefined),
    enabled: !isRegistered && !!selectedSeasonId
  });

  const { data: allLevelsData, isLoading: allLevelsLoading } = useQuery({
    queryKey: ['allLevels'],
    queryFn: getAllLevels,
    enabled: !isRegistered
  });

  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError
  } = useQuery({
    queryKey: ['registrable-courses', selectedSeasonId, selectedSemesterId, selectedLevelId],
    queryFn: () => getRegistrableCourses(selectedSeasonId!, selectedSemesterId!, selectedLevelId!),
    enabled: !!selectedSeasonId && !!selectedSemesterId && !!selectedLevelId,
  });

  const updateRegistrationMutation = useMutation({
    mutationFn: updateStudentRegistrations,
    onSuccess: (data) => {
      toast({
        title: "Registration update successful",
        description: data.message || "Your course registrations have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      setShowRegistrationConfirm(false);
      setSelectedCourses([]);
      setIsEditing(false);
    },
    onError: (error: any) => {
      // MORE ROBUST ERROR MESSAGE EXTRACTION
      const errorMessage = error.response?.data?.message ||
                           error.message ||
                           "An unexpected error occurred.";
      toast({
        title: "Registration update failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

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
      // Apply same robust error message extraction here too
      const errorMessage = error.response?.data?.message ||
                           error.message ||
                           "An unexpected error occurred.";
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });


  const deleteIndividualMutation = useMutation({
    mutationFn: deleteIndividualRegistration,
    onSuccess: () => {
      toast({
        title: "Course deleted",
        description: "The course registration has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      setSelectedRegisteredCourseIds([]);
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.response?.data?.message || "Failed to delete course.",
        variant: "destructive",
      });
    },
  });

  const deleteBatchMutation = useMutation({
    mutationFn: deleteBatchRegistrations,
    onSuccess: (data) => {
      toast({
        title: "Courses deleted",
        description: data.message || "Selected courses have been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      setSelectedRegisteredCourseIds([]);
    },
    onError: (error: any) => {
      toast({
        title: "Batch deletion failed",
        description: error.response?.data?.message || "Failed to delete selected courses.",
        variant: "destructive",
      });
    },
  });


  const currentFilterSeasons = isRegistered && !isEditing
    ? (Array.isArray(registrationsData?.data?.filterOptions?.seasons) ? registrationsData.data.filterOptions.seasons : [])
    : (Array.isArray(allSeasonsData?.data?.seasons) ? allSeasonsData.data.seasons : []);

  const currentFilterSemesters = isRegistered && !isEditing
    ? (Array.isArray(registrationsData?.data?.filterOptions?.semesters) ? registrationsData.data.filterOptions.semesters : [])
    : (Array.isArray(allSemestersData?.data?.semesters) ? allSemestersData.data.semesters : []);

  const currentFilterLevels = isRegistered && !isEditing
    ? (Array.isArray(registrationsData?.data?.filterOptions?.levels) ? registrationsData.data.filterOptions.levels : [])
    : (Array.isArray(allLevelsData?.data?.items) ? allLevelsData.data.items : []);

  const availableCourses = Array.isArray(coursesData?.data?.availableCourses) ? coursesData.data.availableCourses : [];

  // Create a combined list of courses for editing mode
  const combinedCoursesForEditing = React.useMemo(() => {
    // This Map should be of type Map<number, DisplayCourse>
    const courseMap = new Map<number, DisplayCourse>();

    // Add all available courses first
    availableCourses.forEach(course => {
      courseMap.set(course.id, { ...course, isAlreadyRegistered: false }); // Explicitly mark as not registered yet
    });

    // Overlay with currently registered courses, marking them as registered
    registrations.forEach(reg => {
      const existingCourse = courseMap.get(reg.course.id);
      if (existingCourse) {
        // If the course is already in availableCourses, just update its status
        courseMap.set(reg.course.id, { ...existingCourse, isAlreadyRegistered: true });
      } else {
        courseMap.set(reg.course.id, {
          id: reg.course.id,
          code: reg.course.code,
          title: reg.course.title,
          creditUnit: reg.course.creditUnit,
          courseType: reg.course.courseType || 'CORE', 
          isElective: false, 
          preferredSemesterType: reg.course.preferredSemesterType || null,
          isAlreadyRegistered: true, 
        });
      }
    });

    // Sort the combined list for consistent display
    return Array.from(courseMap.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [availableCourses, registrations]);


  const selectedSeason = currentFilterSeasons.find(s => s.id === selectedSeasonId);
  const selectedSemester = currentFilterSemesters.find(s => s.id === selectedSemesterId);
  const selectedLevel = currentFilterLevels.find(l => l.id === selectedLevelId);


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

    const coursesToSubmit = selectedCourses.map(courseId => {
      return { courseId }; // Only send courseId
    });

    if (isEditing) {
      updateRegistrationMutation.mutate({
        seasonId: selectedSeasonId!,
        semesterId: selectedSemesterId!,
        levelId: selectedLevelId!,
        desiredCourses: coursesToSubmit
      });
    } else {
      registerMutation.mutate(coursesToSubmit.map(c => ({
        ...c, // Spread courseId
        seasonId: selectedSeasonId!,
        semesterId: selectedSemesterId!,
        levelId: selectedLevelId!,
      })));
    }
  };

  const handleEditRegistration = () => {
    setIsEditing(true);
    setSelectedCourses(currentlyRegisteredCourseIds);
    setSelectedRegisteredCourseIds([]);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedCourses([]);
    setSelectedRegisteredCourseIds([]);
  };

  const handleSeasonChange = (seasonId: number) => {
    setSelectedSeasonId(seasonId);
    setSelectedSemesterId(null);
    setSelectedRegisteredCourseIds([]);
  };

  const handleSemesterChange = (semesterId: number) => {
    setSelectedSemesterId(semesterId);
    setSelectedRegisteredCourseIds([]);
  };

  const handleLevelChange = (levelId: number) => {
    setSelectedLevelId(levelId);
    setSelectedRegisteredCourseIds([]);
  };

  const handleToggleRegisteredCourseSelection = (registrationId: number, isChecked: boolean) => {
    setSelectedRegisteredCourseIds(prev => {
      if (isChecked) {
        return [...prev, registrationId];
      } else {
        return prev.filter(id => id !== registrationId);
      }
    });
  };

  const handleDeleteIndividual = (registrationId: number) => {
    if (window.confirm("Are you sure you want to delete this course registration?")) {
      deleteIndividualMutation.mutate(registrationId);
    }
  };

  const handleRemoveSelectedCourses = () => {
    if (selectedRegisteredCourseIds.length === 0) {
      toast({ title: "No courses selected", description: "Please select courses to remove.", variant: "destructive" });
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteBatchMutation.mutate(selectedRegisteredCourseIds);
    setShowDeleteConfirm(false);
  };


  if (coursesLoading || registrationsLoading ||
      (!isRegistered && (allSeasonsLoading || allSemestersLoading || allLevelsLoading)) ||
      deleteIndividualMutation.isPending || deleteBatchMutation.isPending ||
      updateRegistrationMutation.isPending || registerMutation.isPending) {
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
            {/* Top Actions */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
              <CourseActions
                isRegistered={isRegistered}
                isEditing={isEditing}
                onEditRegistration={handleEditRegistration}
                onCancelEdit={handleCancelEdit}
                registrations={registrations}
              />
            </div>

            {/* Filters for Registered Courses (only visible when not editing) */}
            {isRegistered && !isEditing && (
              <div className="mb-6">
                <CourseFilters
                  seasons={currentFilterSeasons}
                  semesters={currentFilterSemesters}
                  levels={currentFilterLevels}
                  selectedSeasonId={selectedSeasonId}
                  selectedSemesterId={selectedSemesterId}
                  selectedLevelId={selectedLevelId}
                  onSeasonChange={handleSeasonChange}
                  onSemesterChange={handleSemesterChange}
                  onLevelChange={handleLevelChange}
                  semestersLoading={registrationsLoading}
                />
              </div>
            )}

            {/* Remove Selected Courses Button (only visible when NOT in edit mode) */}
            {isRegistered && !isEditing && selectedRegisteredCourseIds.length > 0 && (
              <div className="mb-4 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleRemoveSelectedCourses}
                  disabled={deleteBatchMutation.isPending}
                >
                  Remove Selected Courses ({selectedRegisteredCourseIds.length})
                </Button>
              </div>
            )}


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
                {/* Registered Courses Section (only visible when NOT in edit mode) */}
                {isRegistered && !isEditing && (
                  <RegisteredCoursesList
                    registrations={registrations}
                    selectedRegisteredCourseIds={selectedRegisteredCourseIds}
                    onToggleRegisteredCourseSelection={handleToggleRegisteredCourseSelection}
                    onDeleteIndividual={handleDeleteIndividual}
                  />
                )}

                {/* Available Courses Section - Show when not registered OR when editing */}
                {(!isRegistered || isEditing) && (
                  <>
                    {combinedCoursesForEditing.length > 0 && (
                      <AvailableCoursesList
                        courses={isEditing ? combinedCoursesForEditing : availableCourses}
                        selectedCourses={selectedCourses}
                        currentlyRegisteredCoursesMap={currentlyRegisteredCoursesMap}
                        isEditing={isEditing}
                        onCourseSelect={handleCourseSelect}
                        onRegister={handleRegister}
                        isRegistering={registerMutation.isPending || updateRegistrationMutation.isPending}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Registration confirmation dialog */}
          <Dialog open={showRegistrationConfirm} onOpenChange={setShowRegistrationConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Confirm Course Update" : "Confirm Course Registration"}
                </DialogTitle>
                <DialogDescription>
                  You are about to {isEditing ? "update" : "register"} {selectedCourses.length} courses for {selectedSeason?.name} {selectedSemester?.name}.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="my-4 max-h-[300px] overflow-y-auto">
                {/* Use the correct source for courses in the confirmation dialog */}
                {(isEditing ? combinedCoursesForEditing : availableCourses)
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
                  disabled={registerMutation.isPending || updateRegistrationMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={handleConfirmRegistration}
                  disabled={registerMutation.isPending || updateRegistrationMutation.isPending}
                >
                  {(registerMutation.isPending || updateRegistrationMutation.isPending)
                    ? 'Processing...'
                    : isEditing
                      ? 'Submit Course Update'
                      : 'Register Selected Courses'
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove the selected {selectedRegisteredCourseIds.length} course(s)?
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteBatchMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={deleteBatchMutation.isPending}
                >
                  {deleteBatchMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
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