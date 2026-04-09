import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jiraRoutes from './routes/jira';
import aiRoutes from './routes/ai';

import { initDb } from './services/db';
import authRoutes from './routes/auth';
import configRoutes from './routes/config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? true // Allow all origins in production (Vercel handles this)
  : 'http://localhost:5174';
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Ensure DB schema is ready before any request is processed (critical for serverless cold starts)
let dbReady: Promise<void> | null = null;
app.use(async (_req, _res, next) => {
  if (!dbReady) {
    dbReady = initDb();
  }
  try {
    await dbReady;
    next();
  } catch (err) {
    console.error('DB init failed:', err);
    // Reset so next request retries
    dbReady = null;
    next(err);
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register secure routes
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/jira', jiraRoutes);
app.use('/api/ai', aiRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Test Orchestrator Backend running on http://localhost:${PORT}`);
  });
}

export default app;
