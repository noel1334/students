
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import CourseList from '@/components/CourseList';

const Courses = () => {
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Courses</h1>
          <CourseList />
        </div>
      </div>
    </>
  );
};

export default Courses;
