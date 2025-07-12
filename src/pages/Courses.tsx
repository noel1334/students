// src/pages/Courses.tsx

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
  registerForCourses,
  getMyRegistrations,
  deleteIndividualRegistration,
  deleteBatchRegistrations,
  type RegistrableCourse,
  type Level,
  type CourseRegistration,
  type Season, // Assuming Season type is defined/available
  type Semester, // Assuming Semester type is defined/available
} from '@/services/courseApiService';
// Correct import assuming getAllSeasons, getAllSemesters, getAllLevels are named exports
import { getAllSeasons, getAllSemesters, getAllLevels } from '@/services/academicPeriodsApiService';


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

  // NEW STATE: For managing selected registered courses for deletion
  const [selectedRegisteredCourseIds, setSelectedRegisteredCourseIds] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // For delete confirmation dialog


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


  // Fetch current registrations (for the "Registered Courses" section and its filter options)
  const { data: registrationsData, isLoading: registrationsLoading } = useQuery({
    queryKey: ['my-registrations', selectedSeasonId, selectedSemesterId],
    queryFn: () => getMyRegistrations(selectedSeasonId!, selectedSemesterId!),
    enabled: !!selectedSeasonId && !!selectedSemesterId,
  });

  // Determine if the student has any registrations for the selected period
  const registrations = Array.isArray(registrationsData?.data?.items) ? registrationsData.data.items : [];
  const isRegistered = registrations.length > 0;
  const registeredCourseIds = registrations?.map(reg => reg.course.id) || [];


  // Fetch global academic periods ONLY IF the student is NOT registered (i.e., new registration flow)
  // This helps prevent unnecessary fetches when the student has existing registrations and filter options are derived from them.
  const { data: allSeasonsData, isLoading: allSeasonsLoading } = useQuery({
    queryKey: ['allSeasons'],
    queryFn: getAllSeasons,
    enabled: !isRegistered // Only enabled if student is not registered
  });

  const { data: allSemestersData, isLoading: allSemestersLoading } = useQuery({
    queryKey: ['allSemesters', selectedSeasonId],
    queryFn: () => getAllSemesters(selectedSeasonId || undefined),
    enabled: !isRegistered && !!selectedSeasonId // Only enabled if student is not registered AND season selected
  });

  const { data: allLevelsData, isLoading: allLevelsLoading } = useQuery({
    queryKey: ['allLevels'],
    queryFn: getAllLevels,
    enabled: !isRegistered // Only enabled if student is not registered
  });

  // Fetch registrable courses (for the "Available Courses" section when not registered or editing)
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError
  } = useQuery({
    queryKey: ['registrable-courses', selectedSeasonId, selectedSemesterId, selectedLevelId],
    queryFn: () => getRegistrableCourses(selectedSeasonId!, selectedSemesterId!, selectedLevelId!),
    enabled: !!selectedSeasonId && !!selectedSemesterId && !!selectedLevelId,
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
      // Reset state related to editing/selection after successful registration
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

  // NEW: Individual delete mutation
  const deleteIndividualMutation = useMutation({
    mutationFn: deleteIndividualRegistration,
    onSuccess: () => {
      toast({
        title: "Course deleted",
        description: "The course registration has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      setSelectedRegisteredCourseIds([]); // Clear selection after deletion
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.response?.data?.message || "Failed to delete course.",
        variant: "destructive",
      });
    },
  });

  // NEW: Batch delete mutation
  const deleteBatchMutation = useMutation({
    mutationFn: deleteBatchRegistrations,
    onSuccess: (data) => {
      toast({
        title: "Courses deleted",
        description: data.message || "Selected courses have been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      setSelectedRegisteredCourseIds([]); // Clear selection after deletion
    },
    onError: (error: any) => {
      toast({
        title: "Batch deletion failed",
        description: error.response?.data?.message || "Failed to delete selected courses.",
        variant: "destructive",
      });
    },
  });


  // Determine which filter options to use based on isRegistered state
  const currentFilterSeasons = isRegistered && !isEditing
    ? (Array.isArray(registrationsData?.data?.filterOptions?.seasons) ? registrationsData.data.filterOptions.seasons : [])
    : (Array.isArray(allSeasonsData?.data?.seasons) ? allSeasonsData.data.seasons : []);

  const currentFilterSemesters = isRegistered && !isEditing
    ? (Array.isArray(registrationsData?.data?.filterOptions?.semesters) ? registrationsData.data.filterOptions.semesters : [])
    : (Array.isArray(allSemestersData?.data?.semesters) ? allSemestersData.data.semesters : []);

  const currentFilterLevels = isRegistered && !isEditing
    ? (Array.isArray(registrationsData?.data?.filterOptions?.levels) ? registrationsData.data.filterOptions.levels : [])
    : (Array.isArray(allLevelsData?.data?.items) ? allLevelsData.data.items : []);

  const courses = Array.isArray(coursesData?.data?.availableCourses) ? coursesData.data.availableCourses : [];


  // Get selected items for display (these still use the *selected* IDs for UI representation)
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

    const registrationsToSubmit = selectedCourses.map(courseId => {
      const course = courses.find(c => c.id === courseId);
      return {
        courseId,
        seasonId: selectedSeasonId,
        semesterId: selectedSemesterId,
        levelId: selectedLevelId,
        programCourseId: course?.programCourseId || undefined,
      };
    });

    registerMutation.mutate(registrationsToSubmit);
  };

  const handleEditRegistration = () => {
    setIsEditing(true);
    // When entering edit mode, pre-select the courses already registered
    setSelectedCourses(registeredCourseIds);
    setSelectedRegisteredCourseIds([]); // Clear any existing registered course selections
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedCourses([]); // Clear selected courses when canceling edit
    setSelectedRegisteredCourseIds([]); // Clear selection for deletion too
  };

  const handleSeasonChange = (seasonId: number) => {
    setSelectedSeasonId(seasonId);
    setSelectedSemesterId(null); // Reset semester when season changes
    setSelectedRegisteredCourseIds([]); // Clear selections on filter change
  };

  const handleSemesterChange = (semesterId: number) => {
    setSelectedSemesterId(semesterId);
    setSelectedRegisteredCourseIds([]); // Clear selections on filter change
  };

  const handleLevelChange = (levelId: number) => {
    setSelectedLevelId(levelId);
    setSelectedRegisteredCourseIds([]); // Clear selections on filter change
  };

  // NEW: Handle checkbox toggle for registered courses for deletion
  const handleToggleRegisteredCourseSelection = (registrationId: number, isChecked: boolean) => {
    setSelectedRegisteredCourseIds(prev => {
      if (isChecked) {
        return [...prev, registrationId];
      } else {
        return prev.filter(id => id !== registrationId);
      }
    });
  };

  // NEW: Handle individual course deletion click
  const handleDeleteIndividual = (registrationId: number) => {
    // Optionally show a confirmation dialog here before mutation
    if (window.confirm("Are you sure you want to delete this course registration?")) {
      deleteIndividualMutation.mutate(registrationId);
    }
  };

  // NEW: Handle "Remove All Selected" button click
  const handleRemoveSelectedCourses = () => {
    if (selectedRegisteredCourseIds.length === 0) {
      toast({ title: "No courses selected", description: "Please select courses to remove.", variant: "destructive" });
      return;
    }
    setShowDeleteConfirm(true); // Open confirmation dialog
  };

  // NEW: Confirm deletion from dialog
  const handleConfirmDelete = () => {
    deleteBatchMutation.mutate(selectedRegisteredCourseIds);
    setShowDeleteConfirm(false); // Close dialog
  };


  // Adjust loading state to include all necessary queries
  // Only check loading for global lists if `isRegistered` is false
  if (coursesLoading || registrationsLoading ||
      (!isRegistered && (allSeasonsLoading || allSemestersLoading || allLevelsLoading)) ||
      deleteIndividualMutation.isPending || deleteBatchMutation.isPending) { // Include deletion loading
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

            {/* NEW: Remove Selected Courses Button */}
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
            {/* END NEW */}


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
                  <RegisteredCoursesList
                    registrations={registrations}
                    selectedRegisteredCourseIds={selectedRegisteredCourseIds} // Pass selected IDs
                    onToggleRegisteredCourseSelection={handleToggleRegisteredCourseSelection} // Pass toggle handler
                    onDeleteIndividual={handleDeleteIndividual} // Pass individual delete handler
                  />
                )}

                {/* Available Courses Section - Only show when not registered or when editing */}
                {(!isRegistered || isEditing) && (
                  <>
                    {/* NO FILTERS HERE, as per your request */}
                    {courses.length > 0 && (
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
                  </>
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

          {/* NEW: Delete Confirmation Dialog */}
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
          {/* END NEW: Delete Confirmation Dialog */}

        </div>
      </div>
    </>
  );
};

export default Courses;