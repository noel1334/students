
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home,
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  Hotel,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
};

const SidebarItem = ({ icon, label, to, active, onClick }: SidebarItemProps) => {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
          active 
            ? "bg-primary text-primary-foreground font-medium shadow-sm" 
            : "text-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {icon}
        <span className="text-sm">{label}</span>
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // Close sidebar on small screens when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebarElement = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (isOpen && sidebarElement && !sidebarElement.contains(event.target as Node) && 
          menuButton && !menuButton.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'Home', icon: <Home size={20} />, to: '/' },
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/dashboard' },
    { label: 'Courses', icon: <BookOpen size={20} />, to: '/courses' },
    { label: 'Results', icon: <GraduationCap size={20} />, to: '/results' },
    { label: 'Payments', icon: <CreditCard size={20} />, to: '/payments' },
    { label: 'Hostel', icon: <Hotel size={20} />, to: '/hostel' },
    { label: 'Profile', icon: <User size={20} />, to: '/profile' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        id="menu-button"
        onClick={toggleSidebar} 
        className="md:hidden fixed top-6 left-4 z-50 text-gray-700"
      >
        <Menu size={24} />
      </button>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        id="sidebar"
        className={cn(
          "h-screen bg-card border-r border-border fixed md:sticky top-0 left-0 z-50 transition-all duration-300 flex flex-col",
          isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full md:translate-x-0 md:w-64"
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/7383ea93-4c04-4010-aab8-ce6d9fcba973.png" alt="Logo" className="w-9 h-9" />
            <h1 className="text-xl font-bold text-primary">ScholarHub</h1>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-border bg-accent/30">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full outline-none">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <UserAvatar 
                  user={{ 
                    profileImage: user?.profileImage, 
                    name: user?.name
                  }} 
                  size="md"
                />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {user?.name || "Student Name"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.departmentName || "Department"}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">{user?.name || "Student"}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {user?.currentSeasonName || "N/A Session"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.currentSemesterName || "N/A Semester"} • {user?.currentLevelName || "N/A Level"}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User size={16} className="mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut size={16} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname === item.to}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
