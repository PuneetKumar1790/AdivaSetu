import { Router, Request, Response } from 'express';
import { NotificationModel } from '../models/Notification';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const list = await NotificationModel.find().sort({ timestamp: -1 }).limit(50).lean();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const notif = await NotificationModel.findOneAndUpdate(
      { id: req.params.id },
      { read: true },
      { new: true }
    );
    res.json(notif);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
