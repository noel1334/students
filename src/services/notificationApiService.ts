// src/services/notificationApiService.ts
// This service handles notification-related API calls.
// The actual email sending is handled by the backend.

import api from '@/config/api';

export interface Notification {
  id: number;
  title?: string;
  message: string;
  type?: 'exam_assignment' | 'payment_reminder' | 'general' | 'info' | 'warning';
  isRead: boolean;
  createdAt: string;
  recipientType?: string;
  recipientId?: number;
  metadata?: {
    examId?: number;
    paymentId?: number;
    [key: string]: any;
  };
}

export interface NotificationsResponse {
  items: Notification[]; // alias of notifications for backward compatibility
  notifications: Notification[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  totalNotifications: number;
  unreadCount: number;
}

/**
 * Fetches notifications for the current student
 */
export const getMyNotifications = async (
  page = 1,
  limit = 20,
  unreadOnly = false
): Promise<NotificationsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(unreadOnly && { isRead: 'false' }),
  });

  const response = await api.get(`/notifications/me?${params}`);
  const data = response.data?.data ?? {};
  const notifications: Notification[] = data.notifications ?? data.items ?? [];
  return {
    items: notifications,
    notifications,
    totalPages: data.totalPages ?? 1,
    currentPage: data.currentPage ?? page,
    totalItems: data.totalNotifications ?? data.totalItems ?? notifications.length,
    totalNotifications: data.totalNotifications ?? data.totalItems ?? notifications.length,
    unreadCount: data.unreadCount ?? notifications.filter(n => !n.isRead).length,
  };
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await api.patch(`/notifications/${notificationId}/read`, { isRead: true });
};

/**
 * Marks all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch('/notifications/me/mark-all-read');
};

/**
 * Gets the unread notification count
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  // Backend exposes unreadCount via /notifications/me. Fetch minimal payload.
  const response = await api.get('/notifications/me?page=1&limit=1');
  return response.data?.data?.unreadCount ?? 0;
};

/**
 * Request a payment reminder email to be sent
 * This is typically called by the backend automatically, but can be triggered manually
 */
export const requestPaymentReminder = async (examId: number): Promise<{ message: string }> => {
  const response = await api.post('/notifications/payment-reminder', { examId });
  return response.data;
};
