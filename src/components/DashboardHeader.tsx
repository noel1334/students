
import React from 'react';
import { Bell, Search } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-border flex justify-between items-center py-4 px-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, John</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64"
          />
        </div>
        
        <div className="relative">
          <Bell className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
          <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center font-medium">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
