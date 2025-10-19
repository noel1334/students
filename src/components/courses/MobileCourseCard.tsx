import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { CourseRegistration } from '@/services/courseApiService';

interface MobileCourseCardProps {
  registration: CourseRegistration;
  isSelected: boolean;
  onToggle: (id: number, checked: boolean) => void;
  onDelete: (id: number) => void;
  showCheckbox?: boolean;
}

const MobileCourseCard = ({
  registration,
  isSelected,
  onToggle,
  onDelete,
  showCheckbox = true
}: MobileCourseCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {showCheckbox && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onToggle(registration.id, checked as boolean)}
            className="mt-1"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="font-semibold text-foreground text-sm">
                {registration.course.code}
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {registration.course.title}
              </div>
            </div>
            {!showCheckbox && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(registration.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="font-normal">
              {registration.course.creditUnit} Units
            </Badge>
            <Badge variant="secondary" className="font-normal">
              {registration.level.name}
            </Badge>
            <Badge 
              variant={registration.course.courseType === 'CORE' ? 'default' : 'outline'}
              className="font-normal"
            >
              {registration.course.courseType}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MobileCourseCard;
