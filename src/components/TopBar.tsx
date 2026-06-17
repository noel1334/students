import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/UserAvatar';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/services/notificationApiService';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: notificationsData, refetch } = useQuery({
    queryKey: ['recentNotifications'],
    queryFn: () => getMyNotifications(1, 5),
    refetchInterval: 30000,
  });
  const unreadCount = notificationsData?.unreadCount ?? 0;
  const items = notificationsData?.items ?? [];

  const handleNotificationClick = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      refetch();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-end gap-2 p-4">
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onMouseEnter={() => setNotifOpen(true)}
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
            onMouseLeave={() => setNotifOpen(false)}
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
            <ScrollArea className="h-[360px]">
              {items.length > 0 ? (
                <div className="divide-y">
                  {items.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-accent/50' : ''
                      }`}
                      onClick={() => {
                        handleNotificationClick(n.id);
                        setNotifOpen(false);
                        navigate('/notifications');
                      }}
                    >
                      <div className="flex gap-3">
                        <span className="text-xl">🔔</span>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm leading-tight">
                              {n.title || 'Notification'}
                            </p>
                            {!n.isRead && (
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
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
                  setNotifOpen(false);
                  navigate('/notifications');
                }}
              >
                View All Notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <UserAvatar 
                user={{ 
                  profileImage: user?.profileImage, 
                  name: user?.name
                }} 
                size="md"
              />
              <div className="text-left hidden sm:block">
                <p className="font-semibold text-sm text-foreground">
                  {user?.name || "Student Name"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.departmentName || "Department"}
                </p>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
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
    </div>
  );
};

export default TopBar;
