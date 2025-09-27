import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import { errorHandler } from './middleware/error.js';

export const createApp = () => {
  const app = express();

  app.use(cors({
    origin: config.clientUrl,
    credentials: true
  }));
  app.use(cookieParser());
  app.use(express.json());

  app.use('/uploads', express.static('uploads'));

  app.use('/api/auth', authRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/transactions', transactionRoutes);

  app.use(errorHandler);
  return app;
};
