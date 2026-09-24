import { Router, Request, Response } from 'express';
import { AuditEventModel } from '../models/AuditEvent';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 15;
    const search = ((req.query.search as string) || '').trim();
    const actorRole = (req.query.actorRole as string) || 'all';

    const query: any = {};

    if (search) {
      query.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { actor: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (actorRole && actorRole !== 'all') {
      query.actorRole = actorRole;
    }

    const total = await AuditEventModel.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize) || 1;
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const skip = (currentPage - 1) * pageSize;

    const data = await AuditEventModel.find(query).sort({ timestamp: -1 }).skip(skip).limit(pageSize).lean();

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

export default router;
