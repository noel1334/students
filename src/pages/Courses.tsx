
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';

const Courses = () => {
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold mb-6">My Courses</h1>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-gray-500">You haven't registered for any courses yet.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
