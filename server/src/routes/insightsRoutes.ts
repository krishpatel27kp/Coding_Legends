import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { getProjectSummary, getProjectTrendsData, getFilterSuggestions } from '../controllers/insightsController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get project summary
router.get('/summary/:projectId', getProjectSummary);

// Get project trends
router.get('/trends/:projectId', getProjectTrendsData);

// Get smart filter suggestions
router.get('/suggestions/:projectId', getFilterSuggestions);

export default router;
