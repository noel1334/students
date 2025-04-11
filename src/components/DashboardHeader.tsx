
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardHeader = () => {
  return (
    <header className="bg-[#1a4aa6] text-white border-b border-[#2657b3] flex justify-between items-center py-4 px-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-white/80">Welcome back, John</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-[#2657b3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#f18c3d] bg-white/10 text-white w-64"
          />
        </div>
        
        <div className="relative">
          <Bell className="text-white hover:text-[#f18c3d] cursor-pointer" size={20} />
          <span className="absolute -top-1 -right-1 bg-[#f18c3d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center font-medium">
            JD
          </div>
          <Button variant="secondary" className="bg-[#f18c3d] hover:bg-[#e67e2e] text-white ml-2">
            Support
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
