import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedRunner.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import dsaRoutes from './routes/dsaRoutes.js';
import aptitudeRoutes from './routes/aptitudeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import companyRoutes from './routes/companyRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy does not allow access from this origin.'), false);
  },
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'PrepGenius AI Backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/companies', companyRoutes);

// Centralized error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  const dbConnected = await connectDB();
  if (dbConnected) {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` PrepGenius AI API Server running on port ${PORT}`);
    console.log(` Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Gemini Model: ${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}`);
    console.log(`=========================================`);
  });
};

startServer();

export default app;
