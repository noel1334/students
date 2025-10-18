
import React, { useState } from 'react';
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
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
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
  );
};

export default Profile;
