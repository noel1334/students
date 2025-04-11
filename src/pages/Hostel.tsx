
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import HostelStatus from '@/components/HostelStatus';

const Hostel = () => {
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Hostel</h1>
          <HostelStatus />
        </div>
      </div>
    </>
  );
};

export default Hostel;
