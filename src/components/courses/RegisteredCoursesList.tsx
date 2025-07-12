
import React from 'react';
import { CourseRegistration } from '@/services/courseApiService';
import { Card, CardContent } from '@/components/ui/card';

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
      <h3 className="text-lg font-semibold mb-4">Your Registered Courses ({registrations.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {registrations.map((registration) => (
          <Card key={registration.id} className="border border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{registration.course.code}</h4>
                  <p className="text-sm text-gray-600 mb-2">{registration.course.title}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Registered
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p><span className="font-medium">Units:</span> {registration.course.creditUnit}</p>
                <p><span className="font-medium">Level:</span> {registration.level.name}</p>
                <p><span className="font-medium">Registered:</span> {new Date(registration.registeredAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RegisteredCoursesList;
