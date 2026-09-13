import {
  Application,
  AuditEvent,
  CommunicationNotice,
  NotificationItem,
  SchemeConfigurationWeights,
  User,
} from '../../types';
import { INITIAL_APPLICANTS, DEMO_OFFICER } from '../../data/initialApplicants';
import { INITIAL_APPLICATIONS } from '../../data/initialApplications';
import { INITIAL_NOTIFICATIONS } from '../../data/initialNotifications';

export interface SystemSettings {
  apiMode: 'mock' | 'real';
  latencyProfile: 'realistic' | 'fast' | 'instant';
  simulatedError: 'none' | 'network_error' | 'gateway_timeout' | 'ai_busy';
  lastSynchronizedAt: string;
}

const DB_PREFIX = 'adivasetu_db_';

const TABLES = {
  USERS: `${DB_PREFIX}users`,
  CURRENT_USER: `${DB_PREFIX}current_user`,
  APPLICATIONS: `${DB_PREFIX}applications`,
  NOTIFICATIONS: `${DB_PREFIX}notifications`,
  AUDIT_EVENTS: `${DB_PREFIX}audit_events`,
  COMMUNICATIONS: `${DB_PREFIX}communications`,
  SCHEME_WEIGHTS: `${DB_PREFIX}scheme_weights`,
  SYSTEM_SETTINGS: `${DB_PREFIX}system_settings`,
};

const DEFAULT_WEIGHTS: SchemeConfigurationWeights = {
  academicPerformance: 30,
  researchProposal: 25,
  eligibilityCompliance: 20,
  institutionRating: 15,
  documentCompleteness: 10,
};

const DEFAULT_SETTINGS: SystemSettings = {
  apiMode: 'mock',
  latencyProfile: 'realistic',
  simulatedError: 'none',
  lastSynchronizedAt: new Date().toISOString(),
};

/**
 * Generate extra simulated applications to demonstrate realistic enterprise-scale
 * server-side pagination (pool of 90+ applications).
 */
function generateSimulatedApplications(baseApps: Application[]): Application[] {
  const schemes = ['NFST', 'NOS', 'TCE-ST', 'PMS-ST', 'PRE-ST'] as const;
  const states = [
    'Jharkhand', 'Odisha', 'Madhya Pradesh', 'Chhattisgarh', 'Assam',
    'Rajasthan', 'Gujarat', 'Meghalaya', 'Nagaland', 'Maharashtra'
  ];
  const tribes = ['Santhal', 'Munda', 'Gond', 'Bhil', 'Khasi', 'Bodo', 'Oraon', 'Ho'];
  const firstNames = [
    'Birsa', 'Sita', 'Jaipal', 'Sunita', 'Mangal', 'Phulo', 'Budhu', 'Shanti',
    'Ramesh', 'Kavita', 'Sanjay', 'Priya', 'Deepak', 'Anita', 'Anand', 'Meena'
  ];
  const lastNames = ['Munda', 'Murmu', 'Soren', 'Tudu', 'Marandi', 'Gond', 'Bhil', 'Tirkey'];
  const statuses: Application['status'][] = [
    'Submitted', 'Scrutiny', 'Deficient', 'Resubmitted', 'Screening', 'Shortlisted', 'Selected', 'Approved'
  ];

  const pool: Application[] = [...baseApps];

  for (let i = 1; i <= 80; i++) {
    const scheme = schemes[i % schemes.length];
    const state = states[i % states.length];
    const tribe = tribes[i % tribes.length];
    const name = `${firstNames[i % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}`;
    const status = statuses[i % statuses.length];
    const id = `ADVS-${scheme}-2026-${String(1000 + i).padStart(5, '0')}`;
    const score = Math.floor(78 + (i % 22));

    pool.push({
      id,
      applicantId: `usr-sim-${i}`,
      applicantName: name,
      applicantPhoto: `https://images.unsplash.com/photo-${1500000000000 + (i * 12345) % 1000000}?w=150`,
      schemeId: `scheme-${scheme.toLowerCase()}`,
      schemeName: scheme === 'NFST' ? 'National Fellowship for ST Students' : `${scheme} Scheme`,
      schemeCode: scheme,
      academicYear: '2026-27',
      status,
      submittedAt: new Date(Date.now() - (i * 86400000 * 0.4)).toISOString(),
      updatedAt: new Date(Date.now() - (i * 3600000)).toISOString(),
      eligibilityStatus: 'Eligible',
      aiScore: score,
      aiConfidence: Number((94 + (i % 5.5)).toFixed(1)),
      state,
      district: 'Central',
      currentStepIndex: 1,
      documentsCount: 5,
      verifiedDocumentsCount: status === 'Deficient' ? 4 : 5,
      timeline: [
        { id: '1', name: 'Application Submitted', hindiName: 'आवेदन जमा', status: 'completed', date: '01 Sep', description: 'Application registered on MoTA Central Gateway.' },
        { id: '2', name: 'AI Scrutiny', hindiName: 'एआई जांच', status: status === 'Submitted' ? 'in_progress' : 'completed', description: 'Multilingual field extraction and registry match.' },
        { id: '3', name: 'Officer Screening', hindiName: 'शासकीय चयन', status: ['Screening', 'Shortlisted', 'Selected', 'Approved'].includes(status) ? 'completed' : 'pending', description: 'Official scrutiny against reservation norms.' },
        { id: '4', name: 'Final Merit Sanction', hindiName: 'अंतिम स्वीकृति', status: ['Selected', 'Approved'].includes(status) ? 'completed' : 'pending', description: 'Merit ranking compilation and DBT sanction.' },
      ],
      auditTrail: [
        {
          id: `aud-sim-${i}`,
          applicationId: id,
          timestamp: new Date().toISOString(),
          actor: 'System Ingestion Gateway',
          actorRole: 'ai',
          action: 'APPLICATION_INGESTED',
          description: `Application ${id} received and indexed into Ministry registry.`,
          statusType: 'info',
        },
      ],
      deficiencies: status === 'Deficient' ? [
        {
          id: `def-sim-${i}`,
          documentType: 'income_certificate',
          documentName: 'Income Certificate',
          issue: 'Certificate validity expired',
          reason: 'Income certificate issued in FY 2024-25. Requires valid FY 2026-27 renewal.',
          severity: 'high',
          recommendedAction: 'Upload renewed FY 2026-27 certificate issued by Tehsildar/SDM.',
          status: 'open',
          createdAt: new Date().toISOString(),
          flagReason: 'Income certificate issued in FY 2024-25. Requires valid FY 2026-27 renewal.',
          flaggedAt: new Date().toISOString(),
          flaggedBy: 'AI Scrutiny Engine',
        }
      ] : [],
      formData: {
        fullName: name,
        fatherName: `Father of ${name}`,
        motherName: `Mother of ${name}`,
        dob: '2001-04-15',
        gender: i % 2 === 0 ? 'Female' : 'Male',
        category: 'ST',
        tribeCommunity: tribe,
        aadhaarNumber: `78294019${String(1000 + i).slice(0, 4)}`,
        annualIncome: String(180000 + (i * 2000)),
        incomeCertificateNo: `INC/2026/${String(1000 + i)}`,
        issuingState: state,
        issueDate: '2026-04-10',
        state,
        district: 'Central',
        address: 'Tribal Scholars Hostel, University Campus',
        pincode: '834001',
        mobile: `98765${String(10000 + i).slice(0, 5)}`,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.gov.in`,
        highestQualification: 'Post Graduation (M.Sc / M.Tech)',
        university: 'Central Tribal University',
        institution: 'School of Environmental Sciences',
        course: 'Ph.D in Applied Sciences',
        specialization: 'Tribal Ecology & Forestry',
        passingYear: '2025',
        percentageOrCgpa: '8.4 CGPA',
        admissionStatus: 'Confirmed',
        researchArea: 'Sustainable Agro-Forestry and Tribal Livelihoods',
        researchProposalTitle: 'Agro-Forestry Practices among Scheduled Tribes',
        supervisorName: 'Prof. S. K. Marandi',
        schemeId: `scheme-${scheme.toLowerCase()}`,
        schemeCode: scheme,
        schemeName: scheme === 'NFST' ? 'National Fellowship for ST Students' : `${scheme} Scheme`,
        bankName: 'State Bank of India',
        accountHolder: name,
        accountNumber: `38910029${String(1000 + i)}`,
        ifsc: 'SBIN0001234',
        branch: 'Central University Branch',
      },
      documents: [],
    });
  }

  return pool;
}

let isDbInitialized = false;

export const browserDb = {
  init(): void {
    if (isDbInitialized) return;
    isDbInitialized = true;

    if (!localStorage.getItem(TABLES.USERS)) {
      localStorage.setItem(TABLES.USERS, JSON.stringify(INITIAL_APPLICANTS));
    }
    if (!localStorage.getItem(TABLES.CURRENT_USER)) {
      localStorage.setItem(TABLES.CURRENT_USER, JSON.stringify(INITIAL_APPLICANTS[0]));
    }
    if (!localStorage.getItem(TABLES.APPLICATIONS)) {
      const seeded = generateSimulatedApplications(INITIAL_APPLICATIONS);
      localStorage.setItem(TABLES.APPLICATIONS, JSON.stringify(seeded));
    }
    if (!localStorage.getItem(TABLES.NOTIFICATIONS)) {
      localStorage.setItem(TABLES.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(TABLES.SCHEME_WEIGHTS)) {
      localStorage.setItem(TABLES.SCHEME_WEIGHTS, JSON.stringify(DEFAULT_WEIGHTS));
    }
    if (!localStorage.getItem(TABLES.SYSTEM_SETTINGS)) {
      localStorage.setItem(TABLES.SYSTEM_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }

    // Always ensure Aarav Kumar's photo is the authentic local portrait
    try {
      const userRaw = localStorage.getItem(TABLES.CURRENT_USER);
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && u.id === 'app-001' && (!u.avatar || u.avatar.includes('photo-1539571696357'))) {
          u.avatar = '/aarav.jpg';
          localStorage.setItem(TABLES.CURRENT_USER, JSON.stringify(u));
        }
      }
    } catch {}
  },

  // 1. Applications Table
  getApplications(): Application[] {
    this.init();
    try {
      const raw = localStorage.getItem(TABLES.APPLICATIONS);
      const list: Application[] = raw ? JSON.parse(raw) : [];
      list.forEach((app) => {
        if (app.applicantId === 'app-001' && (!app.applicantPhoto || app.applicantPhoto.includes('photo-1539571696357'))) {
          app.applicantPhoto = '/aarav.jpg';
        }
      });
      return list;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  saveApplications(apps: Application[]): void {
    localStorage.setItem(TABLES.APPLICATIONS, JSON.stringify(apps));
    this.touchSync();
  },

  findApplicationById(id: string): Application | undefined {
    return this.getApplications().find((a) => a.id.toLowerCase() === id.toLowerCase());
  },

  upsertApplication(app: Application): Application {
    const list = this.getApplications();
    const idx = list.findIndex((a) => a.id.toLowerCase() === app.id.toLowerCase());
    if (idx !== -1) {
      list[idx] = app;
    } else {
      list.unshift(app);
    }
    this.saveApplications(list);
    return app;
  },

  /**
   * Generates a persistent Gov-formatted Application ID dynamically
   * Pattern: ADVS-{SCHEME}-{YEAR}-{RANDOM 5 DIGITS}
   */
  generateApplicationId(schemeCode: string = 'NFST'): string {
    const year = '2026';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `ADVS-${schemeCode.toUpperCase()}-${year}-${randomNum}`;
  },

  // 2. Notifications Table
  getNotifications(): NotificationItem[] {
    this.init();
    try {
      const raw = localStorage.getItem(TABLES.NOTIFICATIONS);
      return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: NotificationItem[]): void {
    localStorage.setItem(TABLES.NOTIFICATIONS, JSON.stringify(notifs));
    this.touchSync();
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = this.getNotifications();
    const item: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

  // 3. Central Audit Log Table
  getAuditEvents(): AuditEvent[] {
    this.init();
    const apps = this.getApplications();
    let events: AuditEvent[] = [];
    apps.forEach((a) => {
      if (Array.isArray(a.auditTrail)) {
        events.push(...a.auditTrail);
      }
    });

    const raw = localStorage.getItem(TABLES.AUDIT_EVENTS);
    if (raw) {
      try {
        const extra: AuditEvent[] = JSON.parse(raw);
        events.push(...extra);
      } catch {}
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  addAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const fullEvent: AuditEvent = {
      ...event,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };

    if (event.applicationId) {
      const app = this.findApplicationById(event.applicationId);
      if (app) {
        if (!app.auditTrail) app.auditTrail = [];
        app.auditTrail.unshift(fullEvent);
        this.upsertApplication(app);
      }
    }

    const raw = localStorage.getItem(TABLES.AUDIT_EVENTS);
    const list: AuditEvent[] = raw ? JSON.parse(raw) : [];
    list.unshift(fullEvent);
    localStorage.setItem(TABLES.AUDIT_EVENTS, JSON.stringify(list.slice(0, 500)));
    this.touchSync();

    return fullEvent;
  },

  // 4. Scheme Weights
  getSchemeWeights(): SchemeConfigurationWeights {
    this.init();
    try {
      const raw = localStorage.getItem(TABLES.SCHEME_WEIGHTS);
      return raw ? JSON.parse(raw) : DEFAULT_WEIGHTS;
    } catch {
      return DEFAULT_WEIGHTS;
    }
  },

  saveSchemeWeights(weights: SchemeConfigurationWeights): void {
    localStorage.setItem(TABLES.SCHEME_WEIGHTS, JSON.stringify(weights));
    this.touchSync();
  },

  // 5. Communications
  getCommunications(): CommunicationNotice[] {
    try {
      const raw = localStorage.getItem(TABLES.COMMUNICATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addCommunication(comm: Omit<CommunicationNotice, 'id' | 'sentAt' | 'status'>): CommunicationNotice {
    const list = this.getCommunications();
    const item: CommunicationNotice = {
      ...comm,
      id: `comm-${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: 'delivered',
    };
    list.unshift(item);
    localStorage.setItem(TABLES.COMMUNICATIONS, JSON.stringify(list));
    this.touchSync();
    return item;
  },

  // 6. User Auth & Session
  getCurrentUser(): User | null {
    this.init();
    try {
      const raw = localStorage.getItem(TABLES.CURRENT_USER);
      return raw ? JSON.parse(raw) : INITIAL_APPLICANTS[0];
    } catch {
      return INITIAL_APPLICANTS[0];
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(TABLES.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(TABLES.CURRENT_USER);
    }
  },

  // 7. System Settings & Observability
  getSystemSettings(): SystemSettings {
    this.init();
    try {
      const raw = localStorage.getItem(TABLES.SYSTEM_SETTINGS);
      return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updateSystemSettings(updates: Partial<SystemSettings>): SystemSettings {
    const current = this.getSystemSettings();
    const next: SystemSettings = { ...current, ...updates };
    localStorage.setItem(TABLES.SYSTEM_SETTINGS, JSON.stringify(next));
    return next;
  },

  touchSync(): string {
    const now = new Date().toISOString();
    const settings = this.getSystemSettings();
    settings.lastSynchronizedAt = now;
    localStorage.setItem(TABLES.SYSTEM_SETTINGS, JSON.stringify(settings));
    return now;
  },

  // 8. Deterministic Hackathon Reset
  resetDatabase(): void {
    localStorage.setItem(TABLES.USERS, JSON.stringify(INITIAL_APPLICANTS));
    localStorage.setItem(TABLES.CURRENT_USER, JSON.stringify(INITIAL_APPLICANTS[0]));
    const seeded = generateSimulatedApplications(INITIAL_APPLICATIONS);
    localStorage.setItem(TABLES.APPLICATIONS, JSON.stringify(seeded));
    localStorage.setItem(TABLES.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(TABLES.SCHEME_WEIGHTS, JSON.stringify(DEFAULT_WEIGHTS));
    localStorage.removeItem(TABLES.AUDIT_EVENTS);
    localStorage.removeItem(TABLES.COMMUNICATIONS);
    localStorage.setItem(TABLES.SYSTEM_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  },
};
