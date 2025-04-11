
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import AcademicPerformance from '@/components/AcademicPerformance';

const Results = () => {
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Results</h1>
          <AcademicPerformance />
        </div>
      </div>
    </>
  );
};

export default Results;
