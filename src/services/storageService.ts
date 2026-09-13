import { Application, CommunicationNotice, NotificationItem, SchemeConfigurationWeights, User } from '../types';
import { browserDb } from './db/browserDb';

export const storageService = {
  // User Authentication
  getCurrentUser(): User | null {
    return browserDb.getCurrentUser();
  },

  setCurrentUser(user: User | null): void {
    browserDb.setCurrentUser(user);
  },

  // Applications
  getApplications(): Application[] {
    return browserDb.getApplications();
  },

  saveApplications(apps: Application[]): void {
    browserDb.saveApplications(apps);
  },

  getApplicationById(id: string): Application | undefined {
    return browserDb.findApplicationById(id);
  },

  updateApplication(updated: Application): void {
    browserDb.upsertApplication(updated);
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return browserDb.getNotifications();
  },

  saveNotifications(notifs: NotificationItem[]): void {
    browserDb.saveNotifications(notifs);
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    return browserDb.addNotification(notif);
  },

  markNotificationAsRead(id: string): void {
    browserDb.markNotificationAsRead(id);
  },

  // Scheme Weights
  getSchemeWeights(): SchemeConfigurationWeights {
    return browserDb.getSchemeWeights();
  },

  saveSchemeWeights(weights: SchemeConfigurationWeights): void {
    browserDb.saveSchemeWeights(weights);
  },

  // Communications
  getCommunications(): CommunicationNotice[] {
    return browserDb.getCommunications();
  },

  saveCommunications(comms: CommunicationNotice[]): void {
    localStorage.setItem('adivasetu_db_communications', JSON.stringify(comms));
    browserDb.touchSync();
  },

  addCommunication(comm: Omit<CommunicationNotice, 'id' | 'sentAt' | 'status'>): CommunicationNotice {
    return browserDb.addCommunication(comm);
  },

  // Full Demo State Reset
  resetDemoData(): void {
    browserDb.resetDatabase();
  },
};
