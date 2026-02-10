import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/settings', authenticate, getSettings);
router.patch('/settings', authenticate, updateSettings);

export default router;
