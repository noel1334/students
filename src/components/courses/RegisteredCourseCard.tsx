// src/components/courses/RegisteredCourseCard.tsx

import React from 'react';
import { CourseRegistration } from '@/services/courseApiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, BookOpen, Calendar } from 'lucide-react';

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
  const canDelete = !registration.isScoreRecorded && !registration.semester.areStudentEditsLocked;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`reg-checkbox-${registration.id}`}
            checked={isSelected}
            onCheckedChange={(checked) => onToggleSelection(registration.id, checked === true)}
            disabled={!canDelete}
            className="mt-1 data-[state=checked]:bg-blue-700"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base text-gray-900 truncate">
                  {registration.course.code}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {registration.course.title}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(registration.id)}
                disabled={!canDelete}
                className="hover:bg-red-50 text-red-600 hover:text-red-700 shrink-0"
                title={!canDelete ? (registration.isScoreRecorded ? "Cannot delete: Score recorded" : "Cannot delete: Registration period locked") : "Delete course"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-3">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{registration.course.creditUnit} Units</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(registration.registeredAt).toLocaleDateString()}</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Registered
              </Badge>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              {registration.level.name}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredCourseCard;
