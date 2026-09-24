import { Router, Request, Response } from 'express';
import { UserModel } from '../models/User';
import { INITIAL_APPLICANTS, DEMO_OFFICER } from '../../src/data/initialApplicants';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    let user;
    if (role === 'officer') {
      user = (await UserModel.findOne({ role: 'officer' }).lean()) || DEMO_OFFICER;
    } else {
      user = (await UserModel.findOne({ id: 'app-001' }).lean()) || INITIAL_APPLICANTS[0];
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findOne({ id: 'app-001' }).lean()) || INITIAL_APPLICANTS[0];
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
