
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';

const Payments = () => {
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold mb-6">My Payments</h1>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-500 mb-2">Payment Status:</p>
            <p className="font-medium text-red-500">Pending</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Issues with Payment Verification?</h3>
              <p className="text-sm text-gray-500 mb-3">Payments are typically verified automatically in the background. If your payment hasn't been verified, please click the button below to requery the verification.</p>
              <button className="w-full py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">
                Requery Payment Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
