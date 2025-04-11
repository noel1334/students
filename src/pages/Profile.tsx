
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';

const Profile = () => {
  const studentInfo = {
    name: "Victor NOEL",
    regNo: "18/50770D/6",
    department: "Science Education",
    program: "Full Time",
    level: "600 Level",
    email: "victor.noel@example.com",
    phone: "+1234567890"
  };

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold mb-6">My Profile</h1>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex flex-col sm:flex-row items-center mb-6">
              <div className="bg-green-200 text-green-800 rounded-full w-20 h-20 flex items-center justify-center text-xl font-bold mb-4 sm:mb-0 sm:mr-6">
                VN
              </div>
              <div>
                <h2 className="text-xl font-bold">{studentInfo.name}</h2>
                <p className="text-gray-500">{studentInfo.regNo}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{studentInfo.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">{studentInfo.program}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Level</p>
                <p className="font-medium">{studentInfo.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{studentInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{studentInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
