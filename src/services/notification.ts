import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { apiService } from './api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

class NotificationService {
  async requestPermission(): Promise<boolean> {
    try {
      const settings = await notifee.requestPermission();
      return settings.authorizationStatus >= 1;
    } catch {
      return false;
    }
  }

  async getFCMToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return null;
      }

      const token = await messaging().getToken();
      return token;
    } catch {
      return null;
    }
  }

  async updateFCMToken(token: string): Promise<void> {
    try {
      await apiService.post('/fcm/update-token', { fcm_token: token });
    } catch {
      // Silent fail
    }
  }

  async initializeNotifications(): Promise<void> {
    try {
      const token = await this.getFCMToken();
      if (token) {
        await this.updateFCMToken(token);
      }
    } catch {
      // Silent fail
    }
  }

  onMessageReceived(callback: (message: any) => void) {
    return messaging().onMessage(callback);
  }

  async getNotifications(): Promise<{ success: boolean; data?: Notification[]; error?: string }> {
    try {
      const response = await apiService.get<{ data: Notification[] }>('/notifications');
      if (response.success && response.data) {
        // Backend return { data: { data: [...] } }
        const notifications = Array.isArray(response.data) ? response.data : response.data.data;
        return { success: true, data: notifications };
      }
      return {
        success: false,
        error: response.error?.message || 'Failed to fetch notifications',
      };
    } catch {
      return {
        success: false,
        error: 'Failed to fetch notifications',
      };
    }
  }

  async getUnreadCount(): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const response = await apiService.get<any>('/notifications/unread-count');
      
      if (response.success && response.data) {
        const count = response.data.unread_count ?? response.data.count ?? response.data;
        return { success: true, count: typeof count === 'number' ? count : 0 };
      }
      
      // Fallback: get all notifications and count unread
      const notifResponse = await this.getNotifications();
      if (notifResponse.success && notifResponse.data) {
        const unreadCount = notifResponse.data.filter(n => !n.is_read).length;
        return { success: true, count: unreadCount };
      }
      
      return {
        success: false,
        error: response.error?.message || 'Failed to fetch unread count',
      };
    } catch {
      return {
        success: false,
        error: 'Failed to fetch unread count',
      };
    }
  }

  async markAsRead(notificationId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.put(`/notifications/${notificationId}/read`);
      if (response.success) {
        return { success: true };
      }
      return {
        success: false,
        error: response.error?.message || 'Failed to mark as read',
      };
    } catch {
      return {
        success: false,
        error: 'Failed to mark as read',
      };
    }
  }

  async markAllAsRead(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.put('/notifications/read-all');
      if (response.success) {
        return { success: true };
      }
      return {
        success: false,
        error: response.error?.message || 'Failed to mark all as read',
      };
    } catch {
      return {
        success: false,
        error: 'Failed to mark all as read',
      };
    }
  }

  async sendTestNotification(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.post('/notifications/test');
      if (response.success) {
        return { success: true };
      }
      return {
        success: false,
        error: response.error?.message || 'Failed to send test notification',
      };
    } catch {
      return {
        success: false,
        error: 'Failed to send test notification',
      };
    }
  }
}

export const notificationService = new NotificationService();
