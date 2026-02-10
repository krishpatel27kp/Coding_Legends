import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many authentication requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const submissionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 submissions per minute
  message: { error: 'Submission rate limit exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const allowedDashboardOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow public submission ingestion from anywhere
    // (We will use per-project origin restrictions in the controller)
    if (!origin) return callback(null, true);

    // 2. Strict check for dashboard-related API paths
    // If we're not using path-based CORS, we can check requested path or just allow dashboard origins
    if (allowedDashboardOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Default to allow for now, but in strict production you'd return error
    callback(null, true);
  },
  credentials: true
}));

// Apply limits to specific routes
app.use('/api/auth', authLimiter);
app.use('/api/v1', submissionLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import submissionRoutes from './routes/submissionRoutes';
import userRoutes from './routes/userRoutes';
import insightsRoutes from './routes/insightsRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/v1', submissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/insights', insightsRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('DataPulse API is running');
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Not Found - ${req.method} ${req.path}` });
});

// Error handling middleware
import { errorMiddleware } from './middleware/errorMiddleware';
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
