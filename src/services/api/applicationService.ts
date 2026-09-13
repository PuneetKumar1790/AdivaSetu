import { Application, ApplicationStatus, AuditEvent, DeficiencyItem, DocumentItem } from '../../types';
import { browserDb } from '../db/browserDb';
import { eventBus } from '../events/eventBus';
import { apiConfig } from './apiConfig';

export interface ApplicationQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  scheme?: string;
  status?: string;
  state?: string;
  sortBy?: 'submittedAt' | 'aiScore' | 'applicantName';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const applicationService = {
  /**
   * Fetch applications with simulated server-side pagination, search & filters
   */
  async getApplications(params: ApplicationQueryParams = {}): Promise<PaginatedResponse<Application>> {
    await apiConfig.simulateLatency('applications', 'Fetching application registry...');

    const {
      page = 1,
      pageSize = 10,
      search = '',
      scheme = 'all',
      status = 'all',
      state = 'all',
      sortBy = 'submittedAt',
      sortOrder = 'desc',
    } = params;

    let list = browserDb.getApplications();

    // 1. Search Filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.applicantName.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q) ||
          (a.formData?.tribeCommunity && a.formData.tribeCommunity.toLowerCase().includes(q))
      );
    }

    // 2. Scheme Filter
    if (scheme && scheme !== 'all') {
      list = list.filter((a) => a.schemeCode.toUpperCase() === scheme.toUpperCase());
    }

    // 3. Status Filter
    if (status && status !== 'all') {
      list = list.filter((a) => a.status.toLowerCase() === status.toLowerCase());
    }

    // 4. State Filter
    if (state && state !== 'all') {
      list = list.filter((a) => a.state.toLowerCase() === state.toLowerCase());
    }

    // 5. Sorting
    list.sort((a, b) => {
      let valA: any = a[sortBy] ?? '';
      let valB: any = b[sortBy] ?? '';

      if (sortBy === 'submittedAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = list.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const startIdx = (currentPage - 1) * pageSize;
    const paginatedData = list.slice(startIdx, startIdx + pageSize);

    return {
      data: paginatedData,
      total,
      page: currentPage,
      pageSize,
      totalPages,
    };
  },

  /**
   * Fetch single application by ID
   */
  async getApplicationById(id: string): Promise<Application | null> {
    await apiConfig.simulateLatency('singleApplication', `Retrieving application ${id}...`);
    const app = browserDb.findApplicationById(id);
    return app || null;
  },

  /**
   * Submit / create a new application
   */
  async submitApplication(payload: Partial<Application>): Promise<Application> {
    await apiConfig.simulateLatency('mutation', 'Submitting application to Ministry Gateway...');

    const schemeCode = payload.schemeCode || 'NFST';
    const newId = payload.id || browserDb.generateApplicationId(schemeCode);

    const newApp: Application = {
      id: newId,
      applicantId: payload.applicantId || 'app-001',
      applicantName: payload.applicantName || 'Aarav Kumar',
      applicantPhoto: payload.applicantPhoto || '/aarav.jpg',
      schemeId: payload.schemeId || `scheme-${schemeCode.toLowerCase()}`,
      schemeName: payload.schemeName || 'National Fellowship for ST Students',
      schemeCode,
      academicYear: payload.academicYear || '2026-27',
      status: 'Submitted',
      currentStepIndex: 1,
      district: payload.district || 'Central',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eligibilityStatus: 'Eligible',
      aiScore: payload.aiScore || 92,
      aiConfidence: payload.aiConfidence || 97.4,
      state: payload.state || 'Jharkhand',
      documentsCount: payload.documents?.length || 5,
      verifiedDocumentsCount: 0,
      timeline: [
        { id: '1', name: 'Application Submitted', hindiName: 'आवेदन जमा', status: 'completed', date: 'Just now', description: 'Application registered on MoTA Central Gateway.' },
        { id: '2', name: 'AI Scrutiny', hindiName: 'एआई जांच', status: 'in_progress', description: 'Multilingual field extraction and registry match in progress.' },
        { id: '3', name: 'Officer Screening', hindiName: 'शासकीय चयन', status: 'pending', description: 'Official scrutiny under Rule 14(b).' },
        { id: '4', name: 'Final Sanction', hindiName: 'अंतिम स्वीकृति', status: 'pending', description: 'Merit ranking compilation and DBT sanction.' },
      ],
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          applicationId: newId,
          timestamp: new Date().toISOString(),
          actor: payload.applicantName || 'Applicant',
          actorRole: 'applicant',
          action: 'APPLICATION_SUBMITTED',
          description: `Application ${newId} formally submitted for ${schemeCode} scheme.`,
          statusType: 'success',
        },
      ],
      deficiencies: [],
      formData: payload.formData as any,
      documents: payload.documents || [],
    };

    browserDb.upsertApplication(newApp);

    // Add notification
    browserDb.addNotification({
      title: 'Application Submitted Successfully',
      message: `Your application ${newId} has been acknowledged. Ingestion into automated AI scrutiny queue is underway.`,
      type: 'info',
      applicationId: newId,
      actionUrl: `/applicant/applications/${newId}`,
      actionLabel: 'Track Status',
    });

    eventBus.publish('application:created', newApp);
    eventBus.publish('application:status_changed', { application: newApp, status: 'Submitted' });

    return newApp;
  },

  /**
   * Update application status (Officer decision / AI pipeline change)
   */
  async updateStatus(
    id: string,
    newStatus: ApplicationStatus,
    actor: string,
    remarks?: string
  ): Promise<Application | null> {
    await apiConfig.simulateLatency('mutation', `Recording status transition to ${newStatus}...`);

    const app = browserDb.findApplicationById(id);
    if (!app) return null;

    app.status = newStatus;
    app.updatedAt = new Date().toISOString();
    if (remarks) app.remarks = remarks;

    // Append audit log
    const auditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      applicationId: id,
      timestamp: new Date().toISOString(),
      actor,
      actorRole: actor.includes('Officer') || actor.includes('Soren') ? 'officer' : 'ai',
      action: `STATUS_CHANGED_${newStatus.toUpperCase()}`,
      description: remarks || `Application status updated to ${newStatus}.`,
      statusType:
        newStatus === 'Approved' || newStatus === 'Selected' || newStatus === 'Shortlisted'
          ? 'success'
          : newStatus === 'Deficient' || newStatus === 'Rejected'
          ? 'alert'
          : 'info',
    };
    app.auditTrail.unshift(auditEvent);

    // Update workflow timeline
    if (newStatus === 'Scrutiny' || newStatus === 'Resubmitted') {
      app.timeline.forEach((t) => {
        if (t.name.includes('Scrutiny') || t.hindiName.includes('जांच')) {
          t.status = 'in_progress';
          t.date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }
      });
    } else if (newStatus === 'Screening' || newStatus === 'Shortlisted') {
      app.timeline.forEach((t) => {
        if (t.name.includes('Scrutiny') || t.hindiName.includes('जांच')) t.status = 'completed';
        if (t.name.includes('Screening') || t.hindiName.includes('चयन')) {
          t.status = 'completed';
          t.date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }
      });
    } else if (newStatus === 'Selected' || newStatus === 'Approved') {
      app.timeline.forEach((t) => {
        t.status = 'completed';
        if (!t.date) t.date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      });
    }

    browserDb.upsertApplication(app);

    // Push notification to applicant
    let notifTitle = `Application Status: ${newStatus}`;
    let notifType: 'info' | 'success' | 'warning' | 'celebration' = 'info';
    let notifMsg = `Your application ${app.id} for ${app.schemeName} has been moved to ${newStatus}.`;

    if (newStatus === 'Shortlisted') {
      notifTitle = '🎉 Application Shortlisted!';
      notifType = 'celebration';
      notifMsg = `Congratulations! Your application ${app.id} has been shortlisted by the Ministry Screening Committee.`;
    } else if (newStatus === 'Selected' || newStatus === 'Approved') {
      notifTitle = '🏆 Fellowship Awarded!';
      notifType = 'celebration';
      notifMsg = `Formal sanction order issued for ${app.schemeName}. You can now view and download your Provisional Award Letter.`;
    } else if (newStatus === 'Deficient') {
      notifTitle = '⚠️ Action Required: Document Deficiency';
      notifType = 'warning';
      notifMsg = `A document deficiency was noted for ${app.id}. Please review and submit a replacement.`;
    }

    browserDb.addNotification({
      title: notifTitle,
      message: notifMsg,
      type: notifType,
      applicationId: app.id,
      actionUrl: `/applicant/applications/${app.id}`,
      actionLabel: 'View Updates',
    });

    eventBus.publish('application:status_changed', { application: app, status: newStatus });

    return app;
  },

  /**
   * Resolve deficiency in an application (The key hackathon demo step)
   */
  async resolveDeficiency(
    applicationId: string,
    documentType: string,
    fileUrl: string,
    fileName: string,
    fileSize: string
  ): Promise<Application | null> {
    await apiConfig.simulateLatency('mutation', 'Resolving deficiency and synchronizing documents...');

    const app = browserDb.findApplicationById(applicationId);
    if (!app) return null;

    // 1. Mark deficiency resolved
    if (app.deficiencies) {
      app.deficiencies = app.deficiencies.map((d) =>
        d.documentType === documentType
          ? {
              ...d,
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
              replacementDocUrl: fileUrl,
              replacementDocName: fileName,
            }
          : d
      );
    }

    // 2. Update documents collection
    if (app.documents) {
      const docIdx = app.documents.findIndex((d) => d.type === documentType);
      if (docIdx !== -1) {
        app.documents[docIdx].fileUrl = fileUrl;
        app.documents[docIdx].fileName = fileName;
        app.documents[docIdx].fileSize = fileSize;
        app.documents[docIdx].uploadedAt = new Date().toISOString();
        app.documents[docIdx].verificationStatus = 'verified';
        app.documents[docIdx].aiConfidence = 98.4;
      }
    }

    // 3. Move application status to Scrutiny / Resubmitted
    app.status = 'Scrutiny';
    app.verifiedDocumentsCount = (app.verifiedDocumentsCount || 0) + 1;
    app.updatedAt = new Date().toISOString();

    // 4. Append audit event
    app.auditTrail.unshift({
      id: `aud-${Date.now()}`,
      applicationId: app.id,
      timestamp: new Date().toISOString(),
      actor: app.applicantName,
      actorRole: 'applicant',
      action: 'DEFICIENCY_DOCUMENT_REPLACED',
      description: `Replacement document (${fileName}) submitted for ${documentType}. Re-scrutiny initiated.`,
      statusType: 'success',
    });

    app.auditTrail.unshift({
      id: `aud-${Date.now() + 1}`,
      applicationId: app.id,
      timestamp: new Date().toISOString(),
      actor: 'AI Scrutiny Engine (v2.4)',
      actorRole: 'ai',
      action: 'AUTOMATED_DOCUMENT_VERIFIED',
      description: `OCR extraction verified valid financial year 2026-27. Confidence 98.4%. Recommended for Officer Scrutiny.`,
      statusType: 'success',
    });

    browserDb.upsertApplication(app);

    // Notification
    browserDb.addNotification({
      title: 'Deficiency Resolved',
      message: `Your replacement document for ${app.id} was verified successfully by AI. Re-scrutiny in progress.`,
      type: 'success',
      applicationId: app.id,
      actionUrl: `/applicant/applications/${app.id}`,
      actionLabel: 'View Status',
    });

    eventBus.publish('application:deficiency_resolved', { applicationId, documentType });
    eventBus.publish('application:status_changed', { application: app, status: 'Scrutiny' });

    return app;
  },
};
