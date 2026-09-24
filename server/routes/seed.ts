import { Router, Request, Response } from 'express';
import { ApplicationModel } from '../models/Application';
import { UserModel } from '../models/User';
import { NotificationModel } from '../models/Notification';
import { AuditEventModel } from '../models/AuditEvent';
import { INITIAL_APPLICANTS, DEMO_OFFICER } from '../../src/data/initialApplicants';
import { INITIAL_APPLICATIONS } from '../../src/data/initialApplications';
import { INITIAL_NOTIFICATIONS } from '../../src/data/initialNotifications';

const router = Router();

export const seedDatabase = async () => {
  const appCount = await ApplicationModel.countDocuments();
  if (appCount === 0) {
    console.log('🌱 [MongoDB] Seeding initial applications and users...');

    // Seed Users
    await UserModel.deleteMany({});
    await UserModel.insertMany([...INITIAL_APPLICANTS, DEMO_OFFICER]);

    // Seed Applications
    await ApplicationModel.deleteMany({});
    const appsToInsert = INITIAL_APPLICATIONS.map((app) => ({
      ...app,
      applicantPhoto: app.applicantId === 'app-001' ? '/aarav.jpg' : app.applicantPhoto,
    }));
    await ApplicationModel.insertMany(appsToInsert);

    // Seed Notifications
    await NotificationModel.deleteMany({});
    await NotificationModel.insertMany(INITIAL_NOTIFICATIONS);

    // Seed Audit Events from Applications
    await AuditEventModel.deleteMany({});
    const auditLogs = INITIAL_APPLICATIONS.flatMap((a) => a.auditTrail || []);
    if (auditLogs.length > 0) {
      await AuditEventModel.insertMany(auditLogs);
    }

    console.log(`✅ [MongoDB] Seeded ${appsToInsert.length} applications and initial records.`);
  }
};

router.post('/', async (_req: Request, res: Response) => {
  try {
    await seedDatabase();
    res.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
