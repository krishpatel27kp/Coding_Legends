import { Router } from 'express';
import { createProject, getProjects, regenerateApiKey, updateProject } from '../controllers/projectController';
import { getSubmissions } from '../controllers/submissionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, createProject);
router.get('/', authenticate, getProjects);
router.put('/:id', authenticate, updateProject);
router.post('/:id/regenerate-key', authenticate, regenerateApiKey);
router.get('/:projectId/submissions', authenticate, getSubmissions);

export default router;
