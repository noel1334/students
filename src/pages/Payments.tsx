
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import PaymentStatus from '@/components/PaymentStatus';

const Payments = () => {
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Payments</h1>
          <PaymentStatus />
        </div>
      </div>
    </>
  );
};

export default Payments;
