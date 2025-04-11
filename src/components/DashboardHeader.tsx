
import React from 'react';
import { Menu } from 'lucide-react';

const DashboardHeader = () => {
  const studentInfo = {
    name: "Victor NOEL",
    profileInitials: "VN"
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-between items-center py-3 px-4 md:px-6">
        <div className="flex items-center space-x-2 md:hidden">
          <Menu className="text-gray-600" size={24} />
        </div>
        
        <div className="hidden md:block">
          {/* Empty space where logo would be on desktop */}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right mr-2">
            <h2 className="font-medium text-gray-800">{studentInfo.name}</h2>
            <p className="text-sm text-gray-500">Profile</p>
          </div>
          <div className="bg-green-200 text-green-800 rounded-full w-10 h-10 flex items-center justify-center font-medium">
            {studentInfo.profileInitials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
