import React, { useState } from 'react';
import { Menu, Settings, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UserAvatar from '@/components/UserAvatar';
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/notificationApiService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Fetch recent notifications (also gives us unreadCount)
  const { data: notificationsData, refetch: refetchNotifications } = useQuery({
    queryKey: ['recentNotifications'],
    queryFn: () => getMyNotifications(1, 5),
    refetchInterval: 30000,
  });

  const unreadCount = notificationsData?.unreadCount ?? 0;

  const handleNotificationClick = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      refetchNotifications();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      refetchNotifications();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };
  
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

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case 'exam_assignment':
        return '📝';
      case 'payment_reminder':
        return '💰';
      case 'warning':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="flex justify-between items-center py-3 px-4 md:px-6">
        <div className="flex items-center space-x-2 md:hidden">
          <Menu className="text-muted-foreground" size={24} />
        </div>
        
        {/* Academic Info - visible on larger screens */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="text-sm">
            <span className="text-muted-foreground">Session:</span>
            <span className="ml-1 font-medium text-foreground">{studentInfo.currentSession}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Semester:</span>
            <span className="ml-1 font-medium text-foreground">{studentInfo.currentSemester}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Level:</span>
            <span className="ml-1 font-medium text-foreground">{studentInfo.level}</span>
          </div>
        </div>
        
        <div className="flex items-center ml-auto gap-4">
          {/* Notification Bell */}
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onMouseEnter={() => setNotificationOpen(true)}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0"
              align="end"
              onMouseLeave={() => setNotificationOpen(false)}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{unreadCount} unread</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={handleMarkAllRead}
                    >
                      Mark all read
                    </Button>
                  </div>
                )}
              </div>
              <ScrollArea className="h-[400px]">
                {notificationsData?.items && notificationsData.items.length > 0 ? (
                  <div className="divide-y">
                    {notificationsData.items.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-accent/50' : ''
                        }`}
                        onClick={() => {
                          handleNotificationClick(notification.id);
                          setNotificationOpen(false);
                          navigate('/notifications');
                        }}
                      >
                        <div className="flex gap-3">
                          <span className="text-xl">{getNotificationIcon(notification.type || 'general')}</span>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm leading-tight">
                                {notification.title || 'Notification'}
                              </p>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                )}
              </ScrollArea>
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate('/notifications');
                  }}
                >
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center">
                <div className="text-right mr-3">
                  <h2 className="font-medium text-foreground">{studentInfo.name}</h2>
                  <div className="text-xs text-muted-foreground">
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
            <DropdownMenuContent align="end" className="w-56">
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
