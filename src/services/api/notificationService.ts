import { NotificationItem } from '../../types';
import { browserDb } from '../db/browserDb';
import { apiConfig } from './apiConfig';

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch {}

    await apiConfig.simulateLatency('singleApplication', 'Fetching user notification feeds...');
    return browserDb.getNotifications();
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch {}
    browserDb.markNotificationAsRead(id);
  },
};
