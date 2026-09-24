import { Router, Request, Response } from 'express';
import { ApplicationModel } from '../models/Application';
import { UserModel } from '../models/User';
import { NotificationModel } from '../models/Notification';
import { AuditEventModel } from '../models/AuditEvent';
import { INITIAL_APPLICANTS, DEMO_OFFICER } from '../../src/data/initialApplicants';
import { INITIAL_APPLICATIONS } from '../../src/data/initialApplications';
import { INITIAL_NOTIFICATIONS } from '../../src/data/initialNotifications';

const router = Router();

function generateFullDataset() {
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
  const statuses = [
    'Submitted', 'Scrutiny', 'Deficient', 'Resubmitted', 'Screening', 'Shortlisted', 'Selected', 'Approved'
  ];

  const pool = [...INITIAL_APPLICATIONS];

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
          actorRole: 'ai' as const,
          action: 'APPLICATION_INGESTED',
          description: `Application ${id} received and indexed into Ministry registry.`,
          statusType: 'info' as const,
        },
      ],
      deficiencies: status === 'Deficient' ? [
        {
          id: `def-sim-${i}`,
          documentType: 'income_certificate',
          documentName: 'Income Certificate',
          issue: 'Certificate validity expired',
          reason: 'Income certificate issued in FY 2024-25. Requires valid FY 2026-27 renewal.',
          severity: 'high' as const,
          recommendedAction: 'Upload renewed FY 2026-27 certificate issued by Tehsildar/SDM.',
          status: 'open' as const,
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
        gender: (i % 2 === 0 ? 'Female' : 'Male') as any,
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

export const seedDatabase = async (force: boolean = false) => {
  const appCount = await ApplicationModel.countDocuments();
  if (appCount === 0 || force) {
    console.log('🌱 [MongoDB] Seeding initial applications and users into MongoDB Atlas...');

    await UserModel.deleteMany({});
    await UserModel.insertMany([...INITIAL_APPLICANTS, DEMO_OFFICER]);

    await ApplicationModel.deleteMany({});
    const fullDataset = generateFullDataset();
    await ApplicationModel.insertMany(fullDataset);

    await NotificationModel.deleteMany({});
    await NotificationModel.insertMany(INITIAL_NOTIFICATIONS);

    await AuditEventModel.deleteMany({});
    const auditLogs = fullDataset.flatMap((a) => a.auditTrail || []);
    if (auditLogs.length > 0) {
      await AuditEventModel.insertMany(auditLogs);
    }

    console.log(`✅ [MongoDB Atlas] Successfully seeded ${fullDataset.length} applications, users, and audit logs!`);
  }
};

router.post('/', async (req: Request, res: Response) => {
  try {
    const force = req.body?.force === true;
    await seedDatabase(force);
    res.json({ message: 'Database seeded successfully into MongoDB Atlas' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
