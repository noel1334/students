
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile = () => {
  const [avatar, setAvatar] = useState<string | null>(null);

  // Student information - in a real app, this would come from an API or context
  const studentInfo = {
    name: "Victor NOEL",
    regNo: "18/50770D/6",
    department: "Science Education",
    program: "Full Time",
    level: "600 Level",
    email: "victor.noel@example.com",
    phone: "+1234567890",
    session: "FIRST SEMESTER, 2024/2025 SESSION"
  };

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader 
            studentInfo={studentInfo}
            avatar={avatar}
            setAvatar={setAvatar}
          />

          {/* Profile Form */}
          <ProfileForm studentInfo={studentInfo} />
        </div>
      </div>
    </>
  );
};

export default Profile;
