import React, { useState } from 'react';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  Notification,
} from '@/services/notificationApiService';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

const getIcon = (type?: string) => {
  switch (type) {
    case 'success':
    case 'payment_reminder':
      return <CheckCircle size={18} className="text-green-500" />;
    case 'warning':
      return <AlertTriangle size={18} className="text-yellow-500" />;
    case 'exam_assignment':
      return <Bell size={18} className="text-primary" />;
    default:
      return <Info size={18} className="text-blue-500" />;
  }
};

const NotificationPanel = () => {
  const queryClient = useQueryClient();
  const [page] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => getMyNotifications(page, 20),
  });

  const notifications: Notification[] = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const handleRead = async (id: number, isRead: boolean) => {
    if (isRead) return;
    try {
      await markNotificationAsRead(id);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['recentNotifications'] });
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      refetch();
      queryClient.invalidateQueries({ queryKey: ['recentNotifications'] });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="link" size="sm" onClick={handleMarkAllRead} className="text-primary">
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-sm text-muted-foreground">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <HoverCard key={notification.id} openDelay={150}>
              <HoverCardTrigger asChild>
                <div
                  onClick={() => handleRead(notification.id, notification.isRead)}
                  className={`p-3 border rounded-md transition-colors cursor-pointer ${
                    notification.isRead
                      ? 'border-border bg-card'
                      : 'border-primary/20 bg-primary/5'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3
                          className={`font-medium text-sm ${
                            !notification.isRead ? 'text-primary' : ''
                          }`}
                        >
                          {notification.title || 'Notification'}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80" side="left">
                <div className="flex gap-2 mb-2">
                  {getIcon(notification.type)}
                  <p className="font-semibold text-sm">
                    {notification.title || 'Notification'}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
