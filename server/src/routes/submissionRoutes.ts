import { Router } from 'express';
import cors from 'cors';
import { submitForm, getSubmissions, getAllSubmissions } from '../controllers/submissionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public ingestion endpoint - Permissive CORS
router.post('/submit/:apiKey', cors(), submitForm);

// Protected dashboard endpoints
router.get('/', authenticate, getAllSubmissions);
router.get('/:projectId', authenticate, getSubmissions);

export default router;
