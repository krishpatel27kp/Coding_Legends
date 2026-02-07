import { Router } from 'express';
import { submitForm, getSubmissions, getAllSubmissions } from '../controllers/submissionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public ingestion endpoint (protected by API Key in params/body, handled in controller)
router.post('/submit/:apiKey', submitForm);

// Protected dashboard endpoints
router.get('/', authenticate, getAllSubmissions);
router.get('/:projectId', authenticate, getSubmissions);

export default router;
