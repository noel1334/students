// src/services/notificationApiService.ts
// This service handles notification-related API calls.
// The actual email sending is handled by the backend.

import api from '@/config/api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'exam_assignment' | 'payment_reminder' | 'general' | 'info' | 'warning';
  isRead: boolean;
  createdAt: string;
  metadata?: {
    examId?: number;
    paymentId?: number;
    [key: string]: any;
  };
}

export interface NotificationsResponse {
  items: Notification[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
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
    ...(unreadOnly && { unreadOnly: 'true' }),
  });

  const response = await api.get(`/notifications/me?${params}`);
  return response.data.data;
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await api.patch(`/notifications/${notificationId}/read`);
};

/**
 * Marks all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch('/notifications/mark-all-read');
};

/**
 * Gets the unread notification count
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get('/notifications/unread-count');
  return response.data.data.count;
};

/**
 * Request a payment reminder email to be sent
 * This is typically called by the backend automatically, but can be triggered manually
 */
export const requestPaymentReminder = async (examId: number): Promise<{ message: string }> => {
  const response = await api.post('/notifications/payment-reminder', { examId });
  return response.data;
};
