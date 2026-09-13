import { Application, ApplicationStatus, AuditEvent, DeficiencyItem, DocumentItem } from '../types';
import { storageService } from './storageService';
import { mockAIScrutinyService } from './mockAIScrutinyService';

export const mockApplicationService = {
  getAll(): Application[] {
    return storageService.getApplications();
  },

  getById(id: string): Application | undefined {
    return storageService.getApplicationById(id);
  },

  createApplication(newApp: Application): Application {
    storageService.updateApplication(newApp);
    storageService.addNotification({
      title: 'Application Created',
      message: `Your application ${newApp.id} for ${newApp.schemeCode} has been initiated as a draft.`,
      type: 'info',
      applicationId: newApp.id,
      actionUrl: `/applicant/applications/${newApp.id}`,
      actionLabel: 'View Application',
    });
    return newApp;
  },

  updateStatus(
    id: string,
    newStatus: ApplicationStatus,
    actor: string,
    remarks?: string
  ): Application | null {
    const app = storageService.getApplicationById(id);
    if (!app) return null;

    app.status = newStatus;
    app.updatedAt = new Date().toISOString();
    if (remarks) app.remarks = remarks;

    // Add audit log
    const auditEvent: AuditEvent = {
      id: 'aud-' + Date.now(),
      applicationId: id,
      timestamp: new Date().toISOString(),
      actor,
      actorRole: actor.includes('Officer') || actor.includes('Soren') ? 'officer' : 'ai',
      action: `STATUS_CHANGE_TO_${newStatus.toUpperCase()}`,
      description: remarks || `Application status updated to ${newStatus}.`,
      statusType:
        newStatus === 'Approved' || newStatus === 'Selected' || newStatus === 'Shortlisted'
          ? 'success'
          : newStatus === 'Deficient' || newStatus === 'Rejected'
          ? 'alert'
          : 'info',
    };
    app.auditTrail.unshift(auditEvent);

    // Update timeline stages
    if (newStatus === 'Scrutiny') {
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

    // Save
    storageService.updateApplication(app);

    // Trigger notification to applicant
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

    storageService.addNotification({
      title: notifTitle,
      message: notifMsg,
      type: notifType,
      applicationId: app.id,
      actionUrl: `/applicant/applications/${app.id}`,
      actionLabel: 'View Details',
    });

    return app;
  },

  resolveDeficiency(
    applicationId: string,
    documentType: string,
    newFileUrl: string,
    newFileName: string,
    newFileSize: string
  ): Application | null {
    const app = storageService.getApplicationById(applicationId);
    if (!app) return null;

    // 1. Mark deficiency as resolved
    app.deficiencies = app.deficiencies.map((def) => {
      if (def.documentType === documentType) {
        return {
          ...def,
          status: 'resolved' as const,
          resolvedAt: new Date().toISOString(),
        };
      }
      return def;
    });

    // 2. Update document item
    app.documents = app.documents.map((doc) => {
      if (doc.type === documentType) {
        return {
          ...doc,
          fileUrl: newFileUrl,
          fileName: newFileName,
          fileSize: newFileSize,
          verificationStatus: 'verified' as const,
          aiConfidence: 98.2,
          flagReason: undefined,
          uploadedAt: new Date().toISOString(),
          extractedData: {
            'Certificate No': 'INC/DEL/2026/8940',
            'Applicant Name': app.applicantName,
            'Validity Period': 'FY 2026-27 (Current & Valid)',
            'Gross Annual Income': `₹${parseInt(app.formData.annualIncome || '240000').toLocaleString('en-IN')}`,
            'Issuing Authority': 'Tehsildar Office, Revenue Dept',
            'Digital Seal': 'Digitally Verified via e-District Gateway',
          },
        };
      }
      return doc;
    });

    // 3. Update application status to Resubmitted & Scrutiny
    app.status = 'Resubmitted';
    app.updatedAt = new Date().toISOString();

    // 4. Update AI Scrutiny report with fresh analysis
    app.aiScrutinyReport = mockAIScrutinyService.analyzeApplication(app);
    app.aiScore = 96.2;

    // 5. Audit Trail
    app.auditTrail.unshift({
      id: 'aud-' + Date.now(),
      applicationId: app.id,
      timestamp: new Date().toISOString(),
      actor: `${app.applicantName} (Applicant)`,
      actorRole: 'applicant',
      action: 'DEFICIENCY_DOCUMENT_REPLACED',
      description: `Applicant uploaded valid replacement for ${documentType}. Automated OCR re-verification scored 98.2% Pass.`,
      statusType: 'success',
    });

    // 6. Update timeline
    app.timeline.forEach((t) => {
      if (t.name.includes('Resubmission') || t.hindiName.includes('पुनः प्रस्तुति')) {
        t.status = 'completed';
        t.date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      }
      if (t.name.includes('Deficiency') || t.hindiName.includes('त्रुटि')) {
        t.status = 'completed';
      }
      if (t.name.includes('Scrutiny') || t.hindiName.includes('जांच')) {
        t.status = 'in_progress';
      }
    });

    storageService.updateApplication(app);

    // Notify applicant
    storageService.addNotification({
      title: 'Replacement Document Verified & Submitted',
      message: `Your updated ${documentType.replace('_', ' ')} has passed AI re-verification (98.2%). Application moved to Scrutiny queue.`,
      type: 'success',
      applicationId: app.id,
      actionUrl: `/applicant/applications/${app.id}`,
      actionLabel: 'Track Status',
    });

    return app;
  },
};
