// src/components/courses/CourseActions.tsx

import React from 'react';
import { Printer, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseFormDownloader from './CourseFormDownloader'; // Import CourseFormDownloader
import { CourseRegistration } from '@/services/courseApiService'; // Import CourseRegistration type

interface CourseActionsProps {
  isRegistered: boolean;
  isEditing: boolean;
  onEditRegistration: () => void;
  onCancelEdit: () => void;
  registrations: CourseRegistration[]; // NEW: Pass registrations here
}

const CourseActions = ({
  isRegistered,
  isEditing,
  onEditRegistration,
  onCancelEdit,
  registrations // Destructure new prop
}: CourseActionsProps) => {

  // When editing, show only the Cancel button
  if (isEditing) {
    return (
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancelEdit}>
          Cancel
        </Button>
      </div>
    );
  }

  // When not editing and not registered, show nothing (or a registration button, handled elsewhere)
  if (!isRegistered) {
    return null;
  }

  // When registered and not editing, show the action buttons
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
      {/* Conditionally render CourseFormDownloader here */}
      {isRegistered && !isEditing && registrations.length > 0 && (
        <CourseFormDownloader registrations={registrations}>
          {/* Children will be the button that triggers the download */}
          <Button className="bg-blue-700 hover:bg-blue-800 w-full sm:w-auto text-sm">
            <Printer className="mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Download Course Form</span>
            <span className="sm:hidden">Download</span>
          </Button>
        </CourseFormDownloader>
      )}

      <Button variant="outline" className="border-gray-300 w-full sm:w-auto text-sm">
        <span className="hidden sm:inline">Generate Exam Card</span>
        <span className="sm:hidden">Exam Card</span>
      </Button>
      <Button
        onClick={onEditRegistration}
        className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto text-sm"
      >
        <Edit className="mr-2 h-4 w-4" /> 
        <span className="hidden sm:inline">Edit Registration</span>
        <span className="sm:hidden">Edit Reg</span>
      </Button>
    </div>
  );
};

export default CourseActions;