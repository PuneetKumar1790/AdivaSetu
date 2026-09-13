import { Application, CommunicationNotice, NotificationItem, SchemeConfigurationWeights, User } from '../types';
import { INITIAL_APPLICANTS, DEMO_OFFICER } from '../data/initialApplicants';
import { INITIAL_APPLICATIONS } from '../data/initialApplications';
import { INITIAL_NOTIFICATIONS } from '../data/initialNotifications';

const KEYS = {
  CURRENT_USER: 'adivasetu_user',
  APPLICATIONS: 'adivasetu_applications',
  NOTIFICATIONS: 'adivasetu_notifications',
  COMMUNICATIONS: 'adivasetu_communications',
  SCHEME_WEIGHTS: 'adivasetu_scheme_weights',
  DEMO_SCENARIO: 'adivasetu_demo_scenario',
};

const DEFAULT_WEIGHTS: SchemeConfigurationWeights = {
  academicPerformance: 30,
  researchProposal: 25,
  eligibilityCompliance: 20,
  institutionRating: 15,
  documentCompleteness: 10,
};

export const storageService = {
  // User Authentication
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (!raw) {
      // Default to Aarav Kumar for initial applicant demo experience
      return INITIAL_APPLICANTS[0];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_APPLICANTS[0];
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  // Applications
  getApplications(): Application[] {
    const raw = localStorage.getItem(KEYS.APPLICATIONS);
    if (!raw) {
      localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  saveApplications(apps: Application[]): void {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
  },

  getApplicationById(id: string): Application | undefined {
    const apps = this.getApplications();
    return apps.find((a) => a.id === id);
  },

  updateApplication(updated: Application): void {
    const apps = this.getApplications();
    const idx = apps.findIndex((a) => a.id === updated.id);
    if (idx !== -1) {
      apps[idx] = updated;
    } else {
      apps.unshift(updated);
    }
    this.saveApplications(apps);
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: NotificationItem[]): void {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = this.getNotifications();
    const item: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    list.unshift(item);
    this.saveNotifications(list);
    return item;
  },

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(updated);
  },

  // Scheme Weights
  getSchemeWeights(): SchemeConfigurationWeights {
    const raw = localStorage.getItem(KEYS.SCHEME_WEIGHTS);
    if (!raw) return DEFAULT_WEIGHTS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_WEIGHTS;
    }
  },

  saveSchemeWeights(weights: SchemeConfigurationWeights): void {
    localStorage.setItem(KEYS.SCHEME_WEIGHTS, JSON.stringify(weights));
  },

  // Communications
  getCommunications(): CommunicationNotice[] {
    const raw = localStorage.getItem(KEYS.COMMUNICATIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveCommunications(comms: CommunicationNotice[]): void {
    localStorage.setItem(KEYS.COMMUNICATIONS, JSON.stringify(comms));
  },

  addCommunication(comm: Omit<CommunicationNotice, 'id' | 'sentAt' | 'status'>): CommunicationNotice {
    const list = this.getCommunications();
    const item: CommunicationNotice = {
      ...comm,
      id: 'comm-' + Date.now(),
      sentAt: new Date().toISOString(),
      status: 'delivered',
    };
    list.unshift(item);
    this.saveCommunications(list);
    return item;
  },

  // Full Demo State Reset
  resetDemoData(): void {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_APPLICANTS[0]));
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(KEYS.SCHEME_WEIGHTS, JSON.stringify(DEFAULT_WEIGHTS));
    localStorage.removeItem(KEYS.COMMUNICATIONS);
  },
};
