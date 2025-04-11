
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ProfileCard from '@/components/ProfileCard';

const Profile = () => {
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <ProfileCard />
        </div>
      </div>
    </>
  );
};

export default Profile;
