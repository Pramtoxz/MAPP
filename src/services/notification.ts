import { apiService } from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  items: Notification[];
  unreadCount: number;
}

class NotificationService {
  async getNotifications(page?: number, limit?: number) {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/notifications?${query}` : '/notifications';

    return apiService.get<NotificationsResponse>(endpoint);
  }

  async markAsRead(id: string) {
    return apiService.put(`/notifications/${id}/read`);
  }
}

export const notificationService = new NotificationService();
