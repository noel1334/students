
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
    <li className="mb-3">
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
          active 
            ? "text-[#1a4aa6] font-semibold" 
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
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
          "h-screen bg-gray-50 fixed md:sticky top-0 left-0 z-50 transition-all duration-300 overflow-y-auto",
          isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full md:translate-x-0 md:w-64"
        )}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/7383ea93-4c04-4010-aab8-ce6d9fcba973.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-lg font-bold text-[#1a4aa6]">ScholarHub</h1>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="py-6">
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
