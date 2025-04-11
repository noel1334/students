
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  Bell, 
  Hotel,
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <li className="mb-2">
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
          active 
            ? "bg-primary text-primary-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'My Courses', icon: <BookOpen size={20} /> },
    { label: 'Results', icon: <GraduationCap size={20} /> },
    { label: 'Payments', icon: <CreditCard size={20} /> },
    { label: 'Notifications', icon: <Bell size={20} /> },
    { label: 'Hostel', icon: <Hotel size={20} /> },
    { label: 'Profile', icon: <User size={20} /> },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar bg-sidebar-background border-r border-sidebar-border transition-all",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex justify-between items-center py-6 px-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-primary">ScholarHub</h1>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>
      
      <div className="py-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={isCollapsed ? '' : item.label}
              active={activeItem === item.label}
              onClick={() => setActiveItem(item.label)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
