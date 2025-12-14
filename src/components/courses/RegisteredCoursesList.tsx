// src/components/courses/RegisteredCoursesList.tsx

import React from 'react';
import { CourseRegistration } from '@/services/courseApiService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Lock, Unlock } from 'lucide-react';
import RegisteredCourseCard from './RegisteredCourseCard';

interface RegisteredCoursesListProps {
  registrations: CourseRegistration[];
  selectedRegisteredCourseIds: number[];
  onToggleRegisteredCourseSelection: (registrationId: number, isChecked: boolean) => void;
  onDeleteIndividual: (registrationId: number) => void;
}

const RegisteredCoursesList = ({
  registrations,
  selectedRegisteredCourseIds,
  onToggleRegisteredCourseSelection,
  onDeleteIndividual
}: RegisteredCoursesListProps) => {
  if (!registrations || registrations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No registered courses found for this period.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Registered Courses ({registrations.length})</h3>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {registrations.map((registration) => {
          const isSelected = selectedRegisteredCourseIds.includes(registration.id);
          return (
            <RegisteredCourseCard
              key={registration.id}
              registration={registration}
              isSelected={isSelected}
              onToggleSelection={onToggleRegisteredCourseSelection}
              onDelete={onDeleteIndividual}
            />
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center"></TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead className="text-center">Units</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Date Registered</TableHead>
              <TableHead className="w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => {
              const isLocked = registration.semester.areStudentEditsLocked || registration.isScoreRecorded;
              const canDelete = !isLocked;
              const isSelected = selectedRegisteredCourseIds.includes(registration.id);

              return (
                <TableRow key={registration.id}>
                  <TableCell className="text-center">
                    <Checkbox
                      id={`reg-checkbox-${registration.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => onToggleRegisteredCourseSelection(registration.id, checked === true)}
                      disabled={!canDelete}
                      className="data-[state=checked]:bg-primary"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{registration.course.code}</TableCell>
                  <TableCell>{registration.course.title}</TableCell>
                  <TableCell className="text-center">{registration.course.creditUnit}</TableCell>
                  <TableCell>{registration.level.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {isLocked ? (
                        <span title="Registration locked"><Lock className="h-4 w-4 text-amber-500" /></span>
                      ) : (
                        <span title="Registration editable"><Unlock className="h-4 w-4 text-green-500" /></span>
                      )}
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Registered
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(registration.registeredAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteIndividual(registration.id)}
                      disabled={!canDelete}
                      className="hover:bg-destructive/10 text-destructive hover:text-destructive disabled:opacity-50"
                      title={!canDelete ? (registration.isScoreRecorded ? "Cannot delete: Score recorded" : "Cannot delete: Registration period locked") : "Delete course"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RegisteredCoursesList;