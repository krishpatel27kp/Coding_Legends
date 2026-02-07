import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import submissionRoutes from './routes/submissionRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/v1', submissionRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('DataPulse API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
