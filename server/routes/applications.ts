import { Router, Request, Response } from 'express';
import { ApplicationModel } from '../models/Application';
import { AuditEventModel } from '../models/AuditEvent';
import { NotificationModel } from '../models/Notification';

const router = Router();

// GET /api/applications - Paginated and filtered
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const search = ((req.query.search as string) || '').trim();
    const scheme = (req.query.scheme as string) || 'all';
    const status = (req.query.status as string) || 'all';
    const state = (req.query.state as string) || 'all';
    const sortBy = (req.query.sortBy as string) || 'submittedAt';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 1 : -1;

    const query: any = {};

    if (search) {
      query.$or = [
        { id: { $regex: search, $options: 'i' } },
        { applicantName: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { 'formData.tribeCommunity': { $regex: search, $options: 'i' } },
      ];
    }

    if (scheme && scheme !== 'all') {
      query.schemeCode = scheme.toUpperCase();
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (state && state !== 'all') {
      query.state = state;
    }

    const total = await ApplicationModel.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize) || 1;
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const skip = (currentPage - 1) * pageSize;

    const sortOption: any = {};
    sortOption[sortBy] = sortOrder;

    const data = await ApplicationModel.find(query).sort(sortOption).skip(skip).limit(pageSize).lean();

    res.json({
      data,
      total,
      page: currentPage,
      pageSize,
      totalPages,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/applications/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const app = await ApplicationModel.findOne({ id: req.params.id }).lean();
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(app);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/applications - Submit new
router.post('/', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const schemeCode = payload.schemeCode || 'NFST';
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = payload.id || `ADVS-${schemeCode.toUpperCase()}-2026-${randomSuffix}`;

    const newApp = new ApplicationModel({
      ...payload,
      id: newId,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: '1',
          name: 'Application Submitted',
          hindiName: 'आवेदन जमा',
          status: 'completed',
          date: 'Just now',
          description: 'Application registered on MoTA Central Gateway.',
        },
        {
          id: '2',
          name: 'AI Scrutiny',
          hindiName: 'एआई जांच',
          status: 'in_progress',
          description: 'Multilingual field extraction and registry match in progress.',
        },
        {
          id: '3',
          name: 'Officer Screening',
          hindiName: 'शासकीय चयन',
          status: 'pending',
          description: 'Official scrutiny under Rule 14(b).',
        },
        {
          id: '4',
          name: 'Final Sanction',
          hindiName: 'अंतिम स्वीकृति',
          status: 'pending',
          description: 'Merit ranking compilation and DBT sanction.',
        },
      ],
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          applicationId: newId,
          timestamp: new Date().toISOString(),
          actor: payload.applicantName || 'Applicant',
          actorRole: 'applicant',
          action: 'APPLICATION_SUBMITTED',
          description: `Application ${newId} submitted for ${schemeCode} scheme.`,
          statusType: 'success',
        },
      ],
    });

    await newApp.save();

    // Create Notification
    await NotificationModel.create({
      id: `notif-${Date.now()}`,
      title: 'Application Submitted',
      message: `Your application ${newId} has been acknowledged. Ingestion into scrutiny queue is underway.`,
      type: 'info',
      applicationId: newId,
      actionUrl: `/applicant/applications/${newId}`,
      actionLabel: 'Track Status',
      read: false,
      timestamp: new Date().toISOString(),
    });

    // Create Audit Event
    await AuditEventModel.create({
      id: `aud-${Date.now()}`,
      applicationId: newId,
      timestamp: new Date().toISOString(),
      actor: payload.applicantName || 'Applicant',
      actorRole: 'applicant',
      action: 'APPLICATION_SUBMITTED',
      description: `Application ${newId} received and indexed in database.`,
      statusType: 'success',
    });

    res.status(201).json(newApp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/applications/:id/status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, actor = 'Dr. Rajesh Soren (Deputy Secretary)', remarks } = req.body;
    const app = await ApplicationModel.findOne({ id: req.params.id });

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    app.status = status;
    app.updatedAt = new Date().toISOString();
    if (remarks) app.remarks = remarks;

    const auditEntry = {
      id: `aud-${Date.now()}`,
      applicationId: app.id,
      timestamp: new Date().toISOString(),
      actor,
      actorRole: actor.includes('Officer') || actor.includes('Soren') ? 'officer' : 'ai',
      action: `STATUS_CHANGED_${status.toUpperCase()}`,
      description: remarks || `Application status updated to ${status}.`,
      statusType:
        status === 'Approved' || status === 'Selected' || status === 'Shortlisted'
          ? 'success'
          : status === 'Deficient' || status === 'Rejected'
          ? 'alert'
          : 'info',
    };

    app.auditTrail.unshift(auditEntry);
    await app.save();

    // Log in central audit table
    await AuditEventModel.create(auditEntry);

    // Push notification
    let notifTitle = `Status Update: ${status}`;
    let notifType = 'info';
    let notifMsg = `Application ${app.id} moved to ${status}.`;

    if (status === 'Shortlisted') {
      notifTitle = '🎉 Application Shortlisted!';
      notifType = 'celebration';
      notifMsg = `Congratulations! Application ${app.id} has been shortlisted by the Ministry Screening Committee.`;
    } else if (status === 'Selected' || status === 'Approved') {
      notifTitle = '🏆 Fellowship Awarded!';
      notifType = 'celebration';
      notifMsg = `Formal sanction order issued for ${app.schemeName}. You can now view and download your Provisional Award Letter.`;
    }

    await NotificationModel.create({
      id: `notif-${Date.now()}`,
      title: notifTitle,
      message: notifMsg,
      type: notifType,
      applicationId: app.id,
      actionUrl: `/applicant/applications/${app.id}`,
      actionLabel: 'View Details',
      read: false,
      timestamp: new Date().toISOString(),
    });

    res.json(app);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/applications/:id/deficiency - Resolve deficiency
router.post('/:id/deficiency', async (req: Request, res: Response) => {
  try {
    const { documentType, fileUrl, fileName, fileSize } = req.body;
    const app = await ApplicationModel.findOne({ id: req.params.id });

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (app.deficiencies) {
      app.deficiencies = app.deficiencies.map((d: any) =>
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

    app.status = 'Scrutiny';
    app.verifiedDocumentsCount = (app.verifiedDocumentsCount || 0) + 1;
    app.updatedAt = new Date().toISOString();

    const auditEntry = {
      id: `aud-${Date.now()}`,
      applicationId: app.id,
      timestamp: new Date().toISOString(),
      actor: app.applicantName,
      actorRole: 'applicant',
      action: 'DEFICIENCY_DOCUMENT_REPLACED',
      description: `Replacement document (${fileName}) submitted for ${documentType}. Re-scrutiny initiated.`,
      statusType: 'success',
    };

    app.auditTrail.unshift(auditEntry);
    await app.save();

    await AuditEventModel.create(auditEntry);

    res.json(app);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
