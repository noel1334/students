// src/components/courses/RegisteredCourseCard.tsx

import React from 'react';
import { CourseRegistration } from '@/services/courseApiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, BookOpen, Calendar, Lock, Unlock } from 'lucide-react';

interface RegisteredCourseCardProps {
  registration: CourseRegistration;
  isSelected: boolean;
  onToggleSelection: (registrationId: number, isChecked: boolean) => void;
  onDelete: (registrationId: number) => void;
}

const RegisteredCourseCard = ({
  registration,
  isSelected,
  onToggleSelection,
  onDelete
}: RegisteredCourseCardProps) => {
  const isLocked = registration.semester.areStudentEditsLocked || registration.isScoreRecorded;
  const canDelete = !isLocked;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`reg-checkbox-${registration.id}`}
            checked={isSelected}
            onCheckedChange={(checked) => onToggleSelection(registration.id, checked === true)}
            disabled={!canDelete}
            className="mt-1 data-[state=checked]:bg-primary"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base text-foreground truncate">
                  {registration.course.code}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {registration.course.title}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(registration.id)}
                disabled={!canDelete}
                className="hover:bg-destructive/10 text-destructive hover:text-destructive shrink-0 disabled:opacity-50"
                title={!canDelete ? (registration.isScoreRecorded ? "Cannot delete: Score recorded" : "Cannot delete: Registration period locked") : "Delete course"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{registration.course.creditUnit} Units</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(registration.registeredAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                {isLocked ? (
                  <span title="Registration locked"><Lock className="h-4 w-4 text-amber-500" /></span>
                ) : (
                  <span title="Registration editable"><Unlock className="h-4 w-4 text-green-500" /></span>
                )}
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Registered
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              {registration.level.name}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredCourseCard;
