// src/pages/Courses.refactored.tsx - Modern mobile-first redesign

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Printer, Edit, FileText, Loader2, Trash2 } from 'lucide-react';
import {
  getRegistrableCourses,
  registerForCourses,
  getMyRegistrations,
  deleteIndividualRegistration,
  deleteBatchRegistrations,
  updateStudentRegistrations,
  type RegistrableCourse,
  type CourseRegistration,
  type DisplayCourse,
} from '@/services/courseApiService';
import { getAllSeasons, getAllSemesters, getAllLevels } from '@/services/academicPeriodsApiService';
import { getMySchoolFeeRecords } from '@/services/feeApiService';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseFormDownloader from '@/components/courses/CourseFormDownloader';
import CoursesSummary from '@/components/courses/CoursesSummary';
import MobileCourseCard from '@/components/courses/MobileCourseCard';

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

  // Fetch payment records
  const { data: paymentData } = useQuery({
    queryKey: ['paymentRecords', user?.id],
    queryFn: getMySchoolFeeRecords,
    enabled: !!user?.id,
  });

  const paymentRecords = Array.isArray(paymentData?.data?.records) ? paymentData.data.records : [];

  const hasCurrentSeasonBeenPaid = useMemo(() => {
    if (!user?.currentSeasonId) return false;
    if (paymentRecords.length === 0) return false;
    const currentSeasonRecord = paymentRecords.find(
      record => record.season.id.toString() === user.currentSeasonId
    );
    return currentSeasonRecord?.paymentStatus === 'PAID';
  }, [paymentRecords, user?.currentSeasonId]);

  useEffect(() => {
    if (user?.currentSeasonId && paymentData && !hasCurrentSeasonBeenPaid) {
      toast({
        title: "Payment Required",
        description: "Please complete your school fees payment to access course registration.",
        variant: "destructive",
      });
      navigate('/payments');
    }
  }, [hasCurrentSeasonBeenPaid, user?.currentSeasonId, paymentData, navigate, toast]);

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

  const { data: allSeasonsData } = useQuery({
    queryKey: ['allSeasons'],
    queryFn: getAllSeasons,
    enabled: !isRegistered
  });

  const { data: allSemestersData } = useQuery({
    queryKey: ['allSemesters', selectedSeasonId],
    queryFn: () => getAllSemesters(selectedSeasonId || undefined),
    enabled: !isRegistered && !!selectedSeasonId
  });

  const { data: allLevelsData } = useQuery({
    queryKey: ['allLevels'],
    queryFn: getAllLevels,
    enabled: !isRegistered
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['registrable-courses', selectedSeasonId, selectedSemesterId, selectedLevelId],
    queryFn: () => getRegistrableCourses(selectedSeasonId!, selectedSemesterId!, selectedLevelId!),
    enabled: !!selectedSeasonId && !!selectedSemesterId && !!selectedLevelId,
  });

  const updateRegistrationMutation = useMutation({
    mutationFn: updateStudentRegistrations,
    onSuccess: (data) => {
      toast({
        title: "Registration updated",
        description: data.message || "Your course registrations have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      setShowRegistrationConfirm(false);
      setSelectedCourses([]);
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || error.message || "An error occurred.",
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
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });

  const deleteIndividualMutation = useMutation({
    mutationFn: deleteIndividualRegistration,
    onSuccess: () => {
      toast({ title: "Course removed" });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
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
      toast({ title: "Courses removed", description: data.message });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      setSelectedRegisteredCourseIds([]);
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.response?.data?.message || "Failed to delete courses.",
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

  const combinedCoursesForEditing = React.useMemo(() => {
    const courseMap = new Map<number, DisplayCourse>();
    availableCourses.forEach(course => {
      courseMap.set(course.id, { ...course, isAlreadyRegistered: false });
    });
    registrations.forEach(reg => {
      const existingCourse = courseMap.get(reg.course.id);
      if (existingCourse) {
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
    return Array.from(courseMap.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [availableCourses, registrations]);

  const selectedSeason = currentFilterSeasons.find(s => s.id === selectedSeasonId);
  const selectedSemester = currentFilterSemesters.find(s => s.id === selectedSemesterId);
  const selectedLevel = currentFilterLevels.find(l => l.id === selectedLevelId);

  const totalUnits = useMemo(() => {
    return registrations.reduce((sum, reg) => sum + reg.course.creditUnit, 0);
  }, [registrations]);

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
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

    const coursesToSubmit = selectedCourses.map(courseId => ({ courseId }));

    if (isEditing) {
      updateRegistrationMutation.mutate({
        seasonId: selectedSeasonId!,
        semesterId: selectedSemesterId!,
        levelId: selectedLevelId!,
        desiredCourses: coursesToSubmit
      });
    } else {
      registerMutation.mutate(coursesToSubmit.map(c => ({
        ...c,
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
  };

  const handleDeleteIndividual = (registrationId: number) => {
    if (window.confirm("Remove this course?")) {
      deleteIndividualMutation.mutate(registrationId);
    }
  };

  const handleRemoveSelected = () => {
    if (selectedRegisteredCourseIds.length === 0) return;
    setShowDeleteConfirm(true);
  };

  if (registrationsLoading || coursesLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Summary Card */}
        <CoursesSummary
          selectedSeason={selectedSeason}
          selectedSemester={selectedSemester}
          selectedLevel={selectedLevel}
          totalCourses={registrations.length}
          totalUnits={totalUnits}
        />

        {/* Action Buttons for Registered Students */}
        {isRegistered && !isEditing && (
          <Card className="p-4">
            <div className="flex flex-col gap-3">
              <CourseFormDownloader registrations={registrations}>
                <Button className="w-full sm:w-auto" size="lg">
                  <Printer className="mr-2 h-4 w-4" />
                  Download Course Form
                </Button>
              </CourseFormDownloader>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1" size="lg">
                  <FileText className="mr-2 h-4 w-4" />
                  Exam Card
                </Button>
                <Button
                  onClick={handleEditRegistration}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  size="lg"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modify Registration
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Cancel Edit Button */}
        {isEditing && (
          <Button onClick={handleCancelEdit} variant="outline" className="w-full" size="lg">
            Cancel Editing
          </Button>
        )}

        {/* Filters */}
        {isRegistered && !isEditing && (
          <Card className="p-4">
            <CourseFilters
              seasons={currentFilterSeasons}
              semesters={currentFilterSemesters}
              levels={currentFilterLevels}
              selectedSeasonId={selectedSeasonId}
              selectedSemesterId={selectedSemesterId}
              selectedLevelId={selectedLevelId}
              onSeasonChange={setSelectedSeasonId}
              onSemesterChange={setSelectedSemesterId}
              onLevelChange={setSelectedLevelId}
              semestersLoading={false}
            />
          </Card>
        )}

        {/* Bulk Delete Button */}
        {isRegistered && !isEditing && selectedRegisteredCourseIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleRemoveSelected}
            className="w-full"
            size="lg"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Selected ({selectedRegisteredCourseIds.length})
          </Button>
        )}

        {/* Registered Courses List */}
        {isRegistered && !isEditing && registrations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-foreground">
                Registered Courses ({registrations.length})
              </h2>
            </div>

            {registrations.map(registration => (
              <MobileCourseCard
                key={registration.id}
                registration={registration}
                isSelected={selectedRegisteredCourseIds.includes(registration.id)}
                onToggle={(id, checked) => {
                  setSelectedRegisteredCourseIds(prev =>
                    checked ? [...prev, id] : prev.filter(i => i !== id)
                  );
                }}
                onDelete={handleDeleteIndividual}
                showCheckbox={true}
              />
            ))}
          </div>
        )}

        {/* Available/Editable Courses */}
        {(!isRegistered || isEditing) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-foreground">
                {isEditing ? 'Modify Courses' : 'Available Courses'}
              </h2>
              <Badge variant="secondary">
                {selectedCourses.length} selected
              </Badge>
            </div>

            {(isEditing ? combinedCoursesForEditing : availableCourses).map(course => (
              <Card
                key={course.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCourseSelect(course.id)}
              >
                <div className="flex gap-3">
                  <Checkbox
                    checked={selectedCourses.includes(course.id)}
                    onCheckedChange={() => handleCourseSelect(course.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                          {course.code}
                          {isEditing && 'isAlreadyRegistered' in course && course.isAlreadyRegistered && (
                            <Badge variant="default" className="text-xs">Registered</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {course.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="outline" className="font-normal">
                        {course.creditUnit} Units
                      </Badge>
                      <Badge 
                        variant={course.courseType === 'CORE' ? 'default' : 'outline'}
                        className="font-normal"
                      >
                        {course.courseType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {selectedCourses.length > 0 && (
              <Button
                onClick={() => setShowRegistrationConfirm(true)}
                className="w-full"
                size="lg"
                disabled={registerMutation.isPending || updateRegistrationMutation.isPending}
              >
                {isEditing ? 'Update Registration' : 'Register Courses'} ({selectedCourses.length})
              </Button>
            )}
          </div>
        )}

        {/* Registration Confirmation Dialog */}
        <Dialog open={showRegistrationConfirm} onOpenChange={setShowRegistrationConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Update Registration" : "Confirm Registration"}
              </DialogTitle>
              <DialogDescription>
                You are about to {isEditing ? "update" : "register"} {selectedCourses.length} courses.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {(isEditing ? combinedCoursesForEditing : availableCourses)
                .filter(course => selectedCourses.includes(course.id))
                .map(course => (
                  <div key={course.id} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                    <div>
                      <div className="font-medium">{course.code}</div>
                      <div className="text-xs text-muted-foreground">{course.title}</div>
                    </div>
                    <div className="text-xs">{course.creditUnit} units</div>
                  </div>
                ))
              }
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRegistrationConfirm(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRegistration}
                disabled={registerMutation.isPending || updateRegistrationMutation.isPending}
                className="w-full sm:w-auto"
              >
                {(registerMutation.isPending || updateRegistrationMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Confirm ${isEditing ? 'Update' : 'Registration'}`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Remove {selectedRegisteredCourseIds.length} course(s)? This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteBatchMutation.mutate(selectedRegisteredCourseIds);
                  setShowDeleteConfirm(false);
                }}
                disabled={deleteBatchMutation.isPending}
                className="w-full sm:w-auto"
              >
                {deleteBatchMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Courses;
