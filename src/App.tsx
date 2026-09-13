import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { ApplicantLayout } from './layouts/ApplicantLayout';
import { OfficerLayout } from './layouts/OfficerLayout';

// Public & Auth Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { DemoPage } from './pages/demo/DemoPage';

// Applicant Pages
import { ApplicantDashboard } from './pages/applicant/Dashboard';
import { SchemesList } from './pages/applicant/SchemesList';
import { EligibilityWizard } from './pages/applicant/EligibilityWizard';
import { ApplicationWizard } from './pages/applicant/ApplicationWizard';
import { ApplicantApplicationsList } from './pages/applicant/ApplicationsList';
import { ApplicationDetails } from './pages/applicant/ApplicationDetails';
import { DeficiencyCenter } from './pages/applicant/DeficiencyCenter';
import { DocumentsVault } from './pages/applicant/DocumentsVault';
import { FellowshipStatus } from './pages/applicant/FellowshipStatus';
import { NotificationsPage } from './pages/applicant/Notifications';
import { ScholarProfile } from './pages/applicant/Profile';

// Admin Pages
import { OfficerDashboard } from './pages/admin/OfficerDashboard';
import { AdminApplicationsList } from './pages/admin/ApplicationsList';
import { ScrutinyQueue } from './pages/admin/ScrutinyQueue';
import { ScrutinyDetail } from './pages/admin/ScrutinyDetail';
import { ScreeningRankings } from './pages/admin/ScreeningRankings';
import { SchemeConfig } from './pages/admin/SchemeConfig';
import { AnalyticsPage } from './pages/admin/Analytics';
import { CommunicationsPage } from './pages/admin/Communications';
import { AdminAuditTrail } from './pages/admin/AuditTrail';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ApplicationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/demo" element={<DemoPage />} />
              </Route>

              {/* Applicant Portal Routes */}
              <Route path="/applicant" element={<ApplicantLayout />}>
                <Route index element={<Navigate to="/applicant/dashboard" replace />} />
                <Route path="dashboard" element={<ApplicantDashboard />} />
                <Route path="schemes" element={<SchemesList />} />
                <Route path="eligibility" element={<EligibilityWizard />} />
                <Route path="application/new" element={<ApplicationWizard />} />
                <Route path="applications" element={<ApplicantApplicationsList />} />
                <Route path="applications/:id" element={<ApplicationDetails />} />
                <Route path="documents" element={<DocumentsVault />} />
                <Route path="deficiencies" element={<DeficiencyCenter />} />
                <Route path="fellowship" element={<FellowshipStatus />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ScholarProfile />} />
              </Route>

              {/* Ministry Officer / Admin Portal Routes */}
              <Route path="/admin" element={<OfficerLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<OfficerDashboard />} />
                <Route path="applications" element={<AdminApplicationsList />} />
                <Route path="applications/:id" element={<ScrutinyDetail />} />
                <Route path="verification" element={<ScrutinyQueue />} />
                <Route path="scrutiny" element={<ScrutinyQueue />} />
                <Route path="scrutiny/:id" element={<ScrutinyDetail />} />
                <Route path="screening" element={<ScreeningRankings />} />
                <Route path="selection" element={<ScreeningRankings />} />
                <Route path="communications" element={<CommunicationsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="schemes" element={<SchemeConfig />} />
                <Route path="audit" element={<AdminAuditTrail />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ApplicationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
