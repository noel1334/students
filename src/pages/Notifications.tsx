
import React from 'react';
import NotificationPanel from '@/components/NotificationPanel';

const Notifications = () => {
  return (
    <div className="flex-1 p-4 sm:p-6 overflow-auto bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Notifications</h1>
          <NotificationPanel />
        </div>
      </div>
  );
};

export default Notifications;
