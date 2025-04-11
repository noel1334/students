
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  to: string;
  active?: boolean;
  onClick?: () => void;
};

const SidebarItem = ({ icon, label, to, active, onClick }: SidebarItemProps) => {
  return (
    <li className="mb-2">
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
          active 
            ? "bg-[#1a4aa6] text-white" 
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/dashboard' },
    { label: 'My Courses', icon: <BookOpen size={20} />, to: '/courses' },
    { label: 'Results', icon: <GraduationCap size={20} />, to: '/results' },
    { label: 'Payments', icon: <CreditCard size={20} />, to: '/payments' },
    { label: 'Notifications', icon: <Bell size={20} />, to: '/notifications' },
    { label: 'Hostel', icon: <Hotel size={20} />, to: '/hostel' },
    { label: 'Profile', icon: <User size={20} />, to: '/profile' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        "h-screen bg-[#f5f7fb] border-r border-sidebar-border transition-all",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex justify-between items-center py-6 px-4 border-b border-sidebar-border bg-[#1a4aa6] text-white">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">ScholarHub</h1>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md text-white hover:bg-white/20"
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
              to={item.to}
              active={location.pathname === item.to}
              onClick={() => {}}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
