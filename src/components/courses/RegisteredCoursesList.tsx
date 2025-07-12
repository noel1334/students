
import React from 'react';
import { CourseRegistration } from '@/services/courseApiService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RegisteredCoursesListProps {
  registrations: CourseRegistration[];
}

const RegisteredCoursesList = ({ registrations }: RegisteredCoursesListProps) => {
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
              <TableHead>Course Code</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RegisteredCoursesList;
