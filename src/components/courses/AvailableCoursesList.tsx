
import React from 'react';
import { RegistrableCourse } from '@/services/courseApiService';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';

interface AvailableCoursesListProps {
  courses: RegistrableCourse[];
  selectedCourses: number[];
  registeredCourseIds: number[];
  isRegistered: boolean;
  isEditing: boolean;
  onCourseSelect: (courseId: number) => void;
  onRegister: () => void;
  isRegistering: boolean;
}

const AvailableCoursesList = ({
  courses,
  selectedCourses,
  registeredCourseIds,
  isRegistered,
  isEditing,
  onCourseSelect,
  onRegister,
  isRegistering
}: AvailableCoursesListProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No courses available for the selected period.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Available Courses</h3>
      <div className="space-y-4">
        {courses.map(course => (
          <CourseCard 
            key={course.id}
            code={course.code}
            title={course.title}
            units={course.creditUnit}
            isSelected={isRegistered && !isEditing ? registeredCourseIds.includes(course.id) : selectedCourses.includes(course.id)}
            onSelect={() => !isRegistered || isEditing ? onCourseSelect(course.id) : undefined}
            isRegistered={isRegistered && !isEditing}
            isElective={course.isElective}
            isCarryOver={course.offeringReason === 'Carryover'}
          />
        ))}
      </div>
      
      {/* Registration Button */}
      {(!isRegistered || isEditing) && selectedCourses.length > 0 && (
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
