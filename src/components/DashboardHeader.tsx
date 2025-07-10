
import React, { useState } from 'react';
import { Menu, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use real user data with fallbacks
  const studentInfo = {
    name: user?.name || "Student Name",
    profileInitials: user?.name 
      ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : "ST",
    level: user?.currentLevelName || "N/A Level",
    courseOfStudy: user?.departmentName || "N/A Department",
    studyMode: user?.studyMode?.replace(/_/g, ' ') || "N/A Mode",
    currentSession: user?.currentSeasonName || "N/A Session",
    currentSemester: user?.currentSemesterName || "N/A Semester"
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-between items-center py-3 px-4 md:px-6">
        <div className="flex items-center space-x-2 md:hidden">
          <Menu className="text-gray-600" size={24} />
        </div>
        
        {/* Academic Info - visible on larger screens */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="text-sm">
            <span className="text-gray-500">Session:</span>
            <span className="ml-1 font-medium text-gray-800">{studentInfo.currentSession}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Semester:</span>
            <span className="ml-1 font-medium text-gray-800">{studentInfo.currentSemester}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Level:</span>
            <span className="ml-1 font-medium text-gray-800">{studentInfo.level}</span>
          </div>
        </div>
        
        <div className="flex items-center ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center">
                <div className="text-right mr-3">
                  <h2 className="font-medium text-gray-800">{studentInfo.name}</h2>
                  <div className="text-xs text-gray-500">
                    <div>{studentInfo.courseOfStudy}</div>
                    <div className="flex items-center">
                      <span>{studentInfo.studyMode}</span>
                      <span className="ml-1">▼</span>
                    </div>
                  </div>
                </div>
                <UserAvatar 
                  user={{ 
                    profileImage: user?.profileImage, 
                    name: user?.name
                  }} 
                  size="md" 
                  className="cursor-pointer"
                />
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
