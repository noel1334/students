
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';

const Hostel = () => {
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold mb-6">My Hostel</h1>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-500 mb-2">Current Status:</p>
            <p className="font-medium text-orange-500">Not Assigned</p>
            <p className="text-sm text-gray-500 mt-4">Hostel accommodation is based on eligibility and availability.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hostel;
