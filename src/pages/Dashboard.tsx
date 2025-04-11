
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ProfileCard from '@/components/ProfileCard';
import CourseList from '@/components/CourseList';
import AcademicPerformance from '@/components/AcademicPerformance';
import PaymentStatus from '@/components/PaymentStatus';
import NotificationPanel from '@/components/NotificationPanel';
import HostelStatus from '@/components/HostelStatus';

const Dashboard = () => {
  return (
    <>
      <DashboardHeader />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <ProfileCard />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CourseList />
                <PaymentStatus />
              </div>
              <div className="space-y-6">
                <AcademicPerformance />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NotificationPanel />
                  <HostelStatus />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
