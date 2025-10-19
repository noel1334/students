import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CoursesSummaryProps {
  selectedSeason?: { name: string };
  selectedSemester?: { name: string };
  selectedLevel?: { name: string };
  totalCourses: number;
  totalUnits: number;
}

const CoursesSummary = ({
  selectedSeason,
  selectedSemester,
  selectedLevel,
  totalCourses,
  totalUnits
}: CoursesSummaryProps) => {
  return (
    <Card className="p-4 sm:p-6 mb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <div className="space-y-3">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Course Registration</h1>
        
        <div className="flex flex-wrap gap-2">
          {selectedSeason && (
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {selectedSeason.name}
            </Badge>
          )}
          {selectedSemester && (
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {selectedSemester.name}
            </Badge>
          )}
          {selectedLevel && (
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {selectedLevel.name}
            </Badge>
          )}
        </div>

        {totalCourses > 0 && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">{totalCourses}</span> Courses
            </div>
            <div>
              <span className="font-semibold text-foreground">{totalUnits}</span> Units
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CoursesSummary;
