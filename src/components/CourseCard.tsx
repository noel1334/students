
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CourseCardProps {
  code: string;
  title: string;
  units: number;
  isSelected: boolean;
  onSelect: () => void;
  isElective?: boolean;
  isCarryOver?: boolean;
  isRegistered?: boolean;
}

const CourseCard = ({
  code,
  title,
  units,
  isSelected,
  onSelect,
  isElective = false,
  isCarryOver = false,
  isRegistered = false
}: CourseCardProps) => {
  return (
    <div className={`flex items-center justify-between border-b border-gray-100 py-3 ${isCarryOver ? 'bg-red-50' : isElective ? 'bg-blue-50' : ''}`}>
      <div className="flex items-center">
        {!isRegistered && (
          <div className="mr-4">
            <Checkbox 
              id={`course-${code}`} 
              checked={isSelected}
              onCheckedChange={onSelect}
              className="data-[state=checked]:bg-blue-700"
            />
          </div>
        )}
        <div>
          <div className="flex items-center">
            <span className="font-medium text-gray-800">{code}</span>
            {isCarryOver && <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">Carryover</span>}
            {isElective && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Elective</span>}
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
