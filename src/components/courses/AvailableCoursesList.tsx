// src/components/courses/AvailableCoursesList.tsx

import React from 'react';
import { RegistrableCourse, CourseRegistration } from '@/services/courseApiService';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
// No Badge import needed here, it's used inside CourseCard

// Extend RegistrableCourse to include the `isAlreadyRegistered` flag
// This type will be used for the `courses` prop in editing mode
export interface DisplayCourse extends RegistrableCourse {
  isAlreadyRegistered?: boolean;
}

interface AvailableCoursesListProps {
  courses: DisplayCourse[]; // Use the new DisplayCourse type
  selectedCourses: number[];
  currentlyRegisteredCoursesMap: Map<number, CourseRegistration>; // Map of courseId -> CourseRegistration
  isEditing: boolean; // Explicitly pass isEditing to control behavior

  onCourseSelect: (courseId: number) => void;
  onRegister: () => void;
  isRegistering: boolean;
}

const AvailableCoursesList = ({
  courses,
  selectedCourses,
  currentlyRegisteredCoursesMap,
  isEditing,
  onCourseSelect,
  onRegister,
  isRegistering
}: AvailableCoursesListProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No courses available for the selected period.
      </div>
    );
  }

  const isSubmitButtonEnabled = !isRegistering && selectedCourses.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Modify Registered Courses" : "Available Courses"}
      </h3>
      <div className="space-y-4">
        {courses.map(course => {
          // Get the full registration object if this course is currently registered
          const registeredReg = currentlyRegisteredCoursesMap.get(course.id);
          const isCurrentlyRegistered = !!registeredReg;

          // Determine if the checkbox for this specific course should be disabled
          // It's disabled if score recorded OR semester locked
          const isCheckboxDisabled = isCurrentlyRegistered && (registeredReg!.isScoreRecorded || registeredReg!.semester.areStudentEditsLocked);
          // Note: The `isAlreadyRegistered` flag in DisplayCourse will come from Courses.tsx's useMemo.
          // We combine it with `isCurrentlyRegistered` for clarity.

          return (
            <CourseCard
              key={course.id}
              code={course.code}
              title={course.title}
              units={course.creditUnit}
              isSelected={selectedCourses.includes(course.id)} // Whether it's checked in the UI
              onSelect={() => onCourseSelect(course.id)}
              isElective={course.isElective}
              isCarryOver={course.offeringReason === 'Carryover'}
              isAlreadyRegistered={isCurrentlyRegistered} // Pass the status (derived from map)
              isCheckboxDisabled={isCheckboxDisabled} // Pass the disable status
              // isRegistered prop is no longer needed as we use isAlreadyRegistered and isCheckboxDisabled
            />
          );
        })}
      </div>

      {/* Registration/Update Button */}
      {isSubmitButtonEnabled && (
        <div className="mt-6 flex justify-center">
          <Button
            className="bg-blue-700 hover:bg-blue-800 w-full md:w-auto md:px-12"
            onClick={onRegister}
            disabled={isRegistering}
          >
            {isRegistering
              ? 'Processing...'
              : isEditing
                ? 'Update Course Registration'
                : 'Register Selected Courses'
            }
          </Button>
        </div>
      )}
    </div>
  );
};

export default AvailableCoursesList;