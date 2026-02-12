import { Router } from 'express';
import { getSettings, updateSettings, changePassword } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/settings', authenticate, getSettings);
router.patch('/settings', authenticate, updateSettings);
router.post('/change-password', authenticate, changePassword);

export default router;
