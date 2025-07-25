
import React from 'react';
import { Printer, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseActionsProps {
  isRegistered: boolean;
  isEditing: boolean;
  onEditRegistration: () => void;
  onCancelEdit: () => void;
}

const CourseActions = ({
  isRegistered,
  isEditing,
  onEditRegistration,
  onCancelEdit
}: CourseActionsProps) => {
  if (!isRegistered || isEditing) {
    return isEditing ? (
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancelEdit}>
          Cancel
        </Button>
      </div>
    ) : null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button className="bg-blue-700 hover:bg-blue-800">
        <Printer className="mr-2 h-4 w-4" /> Download Course Form
      </Button>
      <Button variant="outline" className="border-gray-300">
        Generate Exam Card
      </Button>
      <Button 
        onClick={onEditRegistration}
        className="bg-amber-600 hover:bg-amber-700"
      >
        <Edit className="mr-2 h-4 w-4" /> Edit Registration
      </Button>
    </div>
  );
};

export default CourseActions;
