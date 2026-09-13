import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Application, ApplicationStatus, NotificationItem, SchemeConfigurationWeights } from '../types';
import { storageService } from '../services/storageService';
import { mockApplicationService } from '../services/mockApplicationService';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

interface ApplicationContextType {
  applications: Application[];
  notifications: NotificationItem[];
  schemeWeights: SchemeConfigurationWeights;
  refreshApplications: () => void;
  getApplication: (id: string) => Application | undefined;
  createApplication: (app: Application) => Application;
  updateApplication: (app: Application) => void;
  updateStatus: (id: string, status: ApplicationStatus, remarks?: string) => Application | null;
  resolveDeficiency: (
    applicationId: string,
    documentType: string,
    fileUrl: string,
    fileName: string,
    fileSize: string
  ) => Application | null;
  markNotificationRead: (id: string) => void;
  updateSchemeWeights: (weights: SchemeConfigurationWeights) => void;
  resetAllDemoData: () => void;
  launchHackathonDemoScenario: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(() => storageService.getApplications());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storageService.getNotifications());
  const [schemeWeights, setSchemeWeights] = useState<SchemeConfigurationWeights>(() => storageService.getSchemeWeights());
  const { success, info } = useToast();

  const refreshApplications = useCallback(() => {
    setApplications(storageService.getApplications());
    setNotifications(storageService.getNotifications());
    setSchemeWeights(storageService.getSchemeWeights());
  }, []);

  const getApplication = useCallback((id: string) => {
    return storageService.getApplicationById(id);
  }, []);

  const createApplication = useCallback(
    (app: Application) => {
      const created = mockApplicationService.createApplication(app);
      refreshApplications();
      return created;
    },
    [refreshApplications]
  );

  const updateApplication = useCallback(
    (app: Application) => {
      storageService.updateApplication(app);
      refreshApplications();
    },
    [refreshApplications]
  );

  const updateStatus = useCallback(
    (id: string, status: ApplicationStatus, remarks?: string) => {
      const updated = mockApplicationService.updateStatus(id, status, 'Dr. Rajesh Soren (Deputy Secretary)', remarks);
      if (updated) {
        refreshApplications();
        if (status === 'Shortlisted' || status === 'Selected' || status === 'Approved') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0D3829', '#D97706', '#10B981', '#F59E0B'],
          });
        }
      }
      return updated;
    },
    [refreshApplications]
  );

  const resolveDeficiency = useCallback(
    (applicationId: string, documentType: string, fileUrl: string, fileName: string, fileSize: string) => {
      const updated = mockApplicationService.resolveDeficiency(applicationId, documentType, fileUrl, fileName, fileSize);
      if (updated) {
        refreshApplications();
      }
      return updated;
    },
    [refreshApplications]
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      storageService.markNotificationAsRead(id);
      refreshApplications();
    },
    [refreshApplications]
  );

  const updateSchemeWeights = useCallback(
    (weights: SchemeConfigurationWeights) => {
      storageService.saveSchemeWeights(weights);
      setSchemeWeights(weights);
      success('Scheme Configuration Updated', 'Merit ranking weights updated across the screening engine.');
    },
    [success]
  );

  const resetAllDemoData = useCallback(() => {
    storageService.resetDemoData();
    refreshApplications();
    info('Demo State Reset', 'Initial sample applicants and applications restored.');
  }, [refreshApplications, info]);

  const launchHackathonDemoScenario = useCallback(() => {
    storageService.resetDemoData();
    refreshApplications();
    success('Hackathon Demo Scenario Initialized', 'Aarav Kumar (NFST) preset in Deficient state ready for walkthrough.');
  }, [refreshApplications, success]);

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        notifications,
        schemeWeights,
        refreshApplications,
        getApplication,
        createApplication,
        updateApplication,
        updateStatus,
        resolveDeficiency,
        markNotificationRead,
        updateSchemeWeights,
        resetAllDemoData,
        launchHackathonDemoScenario,
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
