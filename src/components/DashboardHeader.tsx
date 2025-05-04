
import React, { useState } from 'react';
import { Menu, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader = () => {
  const navigate = useNavigate();
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
        
        <div className="flex items-center ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center">
                <div className="text-right mr-3">
                  <h2 className="font-medium text-gray-800">{studentInfo.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center">Profile <span className="ml-1">▼</span></p>
                </div>
                <div className="bg-green-200 text-green-800 rounded-full w-10 h-10 flex items-center justify-center font-medium cursor-pointer">
                  {studentInfo.profileInitials}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                <User size={16} />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                <Settings size={16} />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
