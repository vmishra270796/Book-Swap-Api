import mongoose from 'mongoose';
import { config } from '../config/env.js';

export const connectDB = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri);
  console.log('MongoDB connected');
};
