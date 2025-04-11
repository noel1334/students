
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import NotificationPanel from '@/components/NotificationPanel';

const Notifications = () => {
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Notifications</h1>
          <NotificationPanel />
        </div>
      </div>
    </>
  );
};

export default Notifications;
