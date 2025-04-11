
import React from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, Calendar } from 'lucide-react';

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
};

const NotificationPanel = () => {
  // This would come from an API in a real application
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Course Registration',
      message: 'Course registration for the new semester is now open',
      time: '2 hours ago',
      type: 'info',
      read: false,
    },
    {
      id: '2',
      title: 'Fee Payment Confirmed',
      message: 'Your recent payment of ₦25,000 has been confirmed',
      time: '1 day ago',
      type: 'success',
      read: false,
    },
    {
      id: '3',
      title: 'Assignment Deadline',
      message: 'CSC301 assignment submission deadline extended',
      time: '2 days ago',
      type: 'warning',
      read: true,
    },
    {
      id: '4',
      title: 'Exam Timetable',
      message: 'First semester examination timetable has been published',
      time: '3 days ago',
      type: 'info',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch(type) {
      case 'info':
        return <Info size={18} className="text-blue-500" />;
      case 'success':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-yellow-500" />;
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button className="text-primary hover:text-primary/80 text-sm">
          Mark all as read
        </button>
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-3 border rounded-md transition-colors ${
              notification.read 
                ? 'border-border bg-white' 
                : 'border-primary/20 bg-primary/5'
            }`}
          >
            <div className="flex gap-3">
              <div className="mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-primary hover:text-primary/80 text-sm font-medium">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
