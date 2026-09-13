import { NotificationItem } from '../../types';
import { browserDb } from '../db/browserDb';
import { apiConfig } from './apiConfig';

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    await apiConfig.simulateLatency('singleApplication', 'Fetching user notification feeds...');
    return browserDb.getNotifications();
  },

  async markAsRead(id: string): Promise<void> {
    browserDb.markNotificationAsRead(id);
  },
};
