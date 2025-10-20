// src/components/courses/RegisteredCoursesList.tsx

import React from 'react';
import { CourseRegistration } from '@/services/courseApiService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox'; // NEW IMPORT
import { Button } from '@/components/ui/button'; // NEW IMPORT
import { Trash2 } from 'lucide-react'; // NEW IMPORT

interface RegisteredCoursesListProps {
  registrations: CourseRegistration[];
  // NEW PROPS for selection and deletion
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
      <div className="text-center py-8 text-gray-500">
        No registered courses found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Registered Courses ({registrations.length})</h3>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">
                {/* No master checkbox for simplicity, but could be added here */}
              </TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Registered</TableHead>
              <TableHead className="w-[80px] text-center">Actions</TableHead> {/* NEW COLUMN */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => {
              // Determine if the course can be deleted based on both conditions
              const canDelete = !registration.isScoreRecorded && !registration.semester.areStudentEditsLocked;
              const isSelected = selectedRegisteredCourseIds.includes(registration.id);

              return (
                <TableRow key={registration.id}>
                  <TableCell className="text-center">
                    <Checkbox
                      id={`reg-checkbox-${registration.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => onToggleRegisteredCourseSelection(registration.id, checked === true)}
                      disabled={!canDelete} // Disable checkbox if course cannot be deleted
                      className="data-[state=checked]:bg-blue-700"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{registration.course.code}</TableCell>
                  <TableCell>{registration.course.title}</TableCell>
                  <TableCell>{registration.course.creditUnit}</TableCell>
                  <TableCell>{registration.level.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Registered
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(registration.registeredAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteIndividual(registration.id)}
                      disabled={!canDelete} // Disable button if course cannot be deleted
                      className="hover:bg-red-50 text-red-600 hover:text-red-700"
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