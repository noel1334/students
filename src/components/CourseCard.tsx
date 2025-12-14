// src/components/CourseCard.tsx

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock } from 'lucide-react';

interface CourseCardProps {
  code: string;
  title: string;
  units: number;
  isSelected: boolean;
  onSelect: () => void;
  isElective?: boolean;
  isCarryOver?: boolean;
  isAlreadyRegistered?: boolean;
  isCheckboxDisabled?: boolean;
  isLocked?: boolean; // NEW: Show lock/unlock icon
}

const CourseCard = ({
  code,
  title,
  units,
  isSelected,
  onSelect,
  isElective = false,
  isCarryOver = false,
  isAlreadyRegistered = false,
  isCheckboxDisabled = false,
  isLocked = false
}: CourseCardProps) => {
  return (
    <div className={`flex items-center justify-between border-b border-border py-3 ${isCarryOver ? 'bg-destructive/10' : isElective ? 'bg-primary/10' : ''}`}>
      <div className="flex items-center">
        <div className="mr-4">
          <Checkbox
            id={`course-${code}`}
            checked={isSelected}
            onCheckedChange={onSelect}
            disabled={isCheckboxDisabled}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        <div>
          <div className="flex items-center flex-wrap gap-1">
            <span className="font-medium text-foreground">{code}</span>
            {isCarryOver && <Badge className="px-2 py-0.5 text-xs bg-destructive/20 text-destructive rounded">Carryover</Badge>}
            {isElective && <Badge className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded">Elective</Badge>}
            {isAlreadyRegistered && (
              <Badge className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">Registered</Badge>
            )}
            {/* Lock/Unlock icon for registered courses */}
            {isAlreadyRegistered && (
              isLocked ? (
                <span title="Registration locked - cannot modify"><Lock className="h-4 w-4 text-amber-500 ml-1" /></span>
              ) : (
                <span title="Registration editable"><Unlock className="h-4 w-4 text-green-500 ml-1" /></span>
              )
            )}
          </div>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">Unit Load</p>
        <p className="text-xl font-medium">{units}</p>
      </div>
    </div>
  );
};

export default CourseCard;