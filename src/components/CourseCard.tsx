// src/components/CourseCard.tsx

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge'; // Make sure this is imported

interface CourseCardProps {
  code: string;
  title: string;
  units: number;
  isSelected: boolean;
  onSelect: () => void;
  isElective?: boolean;
  isCarryOver?: boolean;
  isAlreadyRegistered?: boolean; // NEW: Indicates if this course is currently registered
  isCheckboxDisabled?: boolean; // NEW: Controls if the checkbox is disabled
}

const CourseCard = ({
  code,
  title,
  units,
  isSelected,
  onSelect,
  isElective = false,
  isCarryOver = false,
  isAlreadyRegistered = false, // Default to false
  isCheckboxDisabled = false // Default to false
}: CourseCardProps) => {
  return (
    <div className={`flex items-center justify-between border-b border-gray-100 py-3 ${isCarryOver ? 'bg-red-50' : isElective ? 'bg-blue-50' : ''}`}>
      <div className="flex items-center">
        <div className="mr-4">
          <Checkbox
            id={`course-${code}`}
            checked={isSelected}
            onCheckedChange={onSelect}
            disabled={isCheckboxDisabled} // Use the new prop to disable
            className="data-[state=checked]:bg-blue-700"
          />
        </div>
        <div>
          <div className="flex items-center">
            <span className="font-medium text-gray-800">{code}</span>
            {isCarryOver && <Badge className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">Carryover</Badge>}
            {isElective && <Badge className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Elective</Badge>}
            {/* NEW: Indicator for already registered courses */}
            {isAlreadyRegistered && (
              <Badge className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Registered</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Unit Load</p>
        <p className="text-xl font-medium">{units}</p>
      </div>
    </div>
  );
};

export default CourseCard;