import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { seedDatabase } from './routes/seed';
import applicationsRouter from './routes/applications';
import analyticsRouter from './routes/analytics';
import auditRouter from './routes/audit';
import notificationsRouter from './routes/notifications';
import authRouter from './routes/auth';
import seedRouter from './routes/seed';
import documentsRouter from './routes/documents';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// API Routes
app.use('/api/applications', applicationsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/audit-logs', auditRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/seed', seedRouter);
app.use('/api/documents', documentsRouter);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AdivaSetu Core Backend API',
    database: process.env.MONGODB_URI ? 'configured' : 'waiting_for_password',
  });
});

// Auto-connect and seed if running as standalone server
if (process.env.NODE_ENV !== 'test') {
  connectDB().then((connected) => {
    if (connected) {
      seedDatabase().catch((err) => console.error('Seeding error:', err));
    }
  });
}

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 [AdivaSetu Backend] Server running on http://localhost:${PORT}`);
  });
}

export default app;
