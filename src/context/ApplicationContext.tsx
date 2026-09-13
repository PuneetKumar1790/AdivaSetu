import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { Application, ApplicationStatus, NotificationItem, SchemeConfigurationWeights } from '../types';
import { browserDb } from '../services/db/browserDb';
import { applicationService, ApplicationQueryParams, PaginatedResponse } from '../services/api/applicationService';
import { eventBus } from '../services/events/eventBus';
import { apiConfig } from '../services/api/apiConfig';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

interface ApplicationContextType {
  applications: Application[];
  notifications: NotificationItem[];
  schemeWeights: SchemeConfigurationWeights;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  refreshApplications: () => Promise<void>;
  fetchApplicationsPaged: (params?: ApplicationQueryParams) => Promise<PaginatedResponse<Application>>;
  getApplication: (id: string) => Application | undefined;
  createApplication: (app: Application) => Promise<Application>;
  updateApplication: (app: Application) => void;
  updateStatus: (id: string, status: ApplicationStatus, remarks?: string) => Promise<Application | null>;
  resolveDeficiency: (
    applicationId: string,
    documentType: string,
    fileUrl: string,
    fileName: string,
    fileSize: string
  ) => Promise<Application | null>;
  markNotificationRead: (id: string) => void;
  updateSchemeWeights: (weights: SchemeConfigurationWeights) => void;
  resetAllDemoData: () => void;
  launchHackathonDemoScenario: () => void;
  clearError: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(() => browserDb.getApplications());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => browserDb.getNotifications());
  const [schemeWeights, setSchemeWeights] = useState<SchemeConfigurationWeights>(() => browserDb.getSchemeWeights());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { success, info, error: toastError } = useToast();

  const refreshApplications = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    try {
      await apiConfig.simulateLatency('singleApplication', 'Syncing Ministry data cache...');
      setApplications(browserDb.getApplications());
      setNotifications(browserDb.getNotifications());
      setSchemeWeights(browserDb.getSchemeWeights());
    } catch (err: any) {
      const msg = err?.message || 'Failed to synchronize with Ministry Gateway';
      setError(msg);
      toastError('Sync Error', msg);
    } finally {
      setIsSyncing(false);
    }
  }, [toastError]);

  // Server-side paginated fetcher for enterprise tables
  const fetchApplicationsPaged = useCallback(
    async (params: ApplicationQueryParams = {}): Promise<PaginatedResponse<Application>> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await applicationService.getApplications(params);
        return result;
      } catch (err: any) {
        const msg = err?.message || 'Failed to retrieve application records';
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getApplication = useCallback((id: string) => {
    return browserDb.findApplicationById(id);
  }, []);

  const createApplication = useCallback(
    async (app: Application) => {
      setIsSyncing(true);
      try {
        const created = await applicationService.submitApplication(app);
        setApplications(browserDb.getApplications());
        setNotifications(browserDb.getNotifications());
        success('Application Submitted', `Application ${created.id} received by Ministry Gateway.`);
        return created;
      } finally {
        setIsSyncing(false);
      }
    },
    [success]
  );

  const updateApplication = useCallback((app: Application) => {
    browserDb.upsertApplication(app);
    setApplications(browserDb.getApplications());
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: ApplicationStatus, remarks?: string) => {
      setIsSyncing(true);
      try {
        const updated = await applicationService.updateStatus(
          id,
          status,
          'Dr. Rajesh Soren (Deputy Secretary, MOTA)',
          remarks
        );
        if (updated) {
          setApplications(browserDb.getApplications());
          setNotifications(browserDb.getNotifications());

          if (status === 'Shortlisted' || status === 'Selected' || status === 'Approved') {
            confetti({
              particleCount: 90,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#0D3829', '#D97706', '#10B981', '#F59E0B'],
            });
          }
        }
        return updated;
      } finally {
        setIsSyncing(false);
      }
    },
    []
  );

  const resolveDeficiency = useCallback(
    async (
      applicationId: string,
      documentType: string,
      fileUrl: string,
      fileName: string,
      fileSize: string
    ) => {
      setIsSyncing(true);
      try {
        const updated = await applicationService.resolveDeficiency(
          applicationId,
          documentType,
          fileUrl,
          fileName,
          fileSize
        );
        if (updated) {
          setApplications(browserDb.getApplications());
          setNotifications(browserDb.getNotifications());
          success('Deficiency Resolved', 'Document re-verified by AI engine and moved to Scrutiny queue.');
        }
        return updated;
      } finally {
        setIsSyncing(false);
      }
    },
    [success]
  );

  const markNotificationRead = useCallback((id: string) => {
    browserDb.markNotificationAsRead(id);
    setNotifications(browserDb.getNotifications());
  }, []);

  const updateSchemeWeights = useCallback(
    (weights: SchemeConfigurationWeights) => {
      browserDb.saveSchemeWeights(weights);
      setSchemeWeights(weights);
      success('Scheme Configuration Updated', 'Merit ranking weights updated across the screening engine.');
    },
    [success]
  );

  const resetAllDemoData = useCallback(() => {
    browserDb.resetDatabase();
    setApplications(browserDb.getApplications());
    setNotifications(browserDb.getNotifications());
    setSchemeWeights(browserDb.getSchemeWeights());
    setError(null);
    info('Demo State Reset', 'Initial sample applicants and applications restored.');
  }, [info]);

  const launchHackathonDemoScenario = useCallback(() => {
    browserDb.resetDatabase();
    setApplications(browserDb.getApplications());
    setNotifications(browserDb.getNotifications());
    setSchemeWeights(browserDb.getSchemeWeights());
    setError(null);
    success('Hackathon Demo Scenario Initialized', 'Aarav Kumar (NFST) preset in Deficient state ready for walkthrough.');
  }, [success]);

  const clearError = useCallback(() => {
    apiConfig.clearSimulatedError();
    setError(null);
  }, []);

  // Listen to simulated WebSockets real-time event bus
  useEffect(() => {
    const unsub1 = eventBus.subscribe('application:status_changed', () => {
      setApplications(browserDb.getApplications());
      setNotifications(browserDb.getNotifications());
    });
    const unsub2 = eventBus.subscribe('application:deficiency_resolved', () => {
      setApplications(browserDb.getApplications());
      setNotifications(browserDb.getNotifications());
    });
    const unsub3 = eventBus.subscribe('notification:created', () => {
      setNotifications(browserDb.getNotifications());
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        notifications,
        schemeWeights,
        isLoading,
        isSyncing,
        error,
        refreshApplications,
        fetchApplicationsPaged,
        getApplication,
        createApplication,
        updateApplication,
        updateStatus,
        resolveDeficiency,
        markNotificationRead,
        updateSchemeWeights,
        resetAllDemoData,
        launchHackathonDemoScenario,
        clearError,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = (): ApplicationContextType => {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplication must be used within an ApplicationProvider');
  return ctx;
};
