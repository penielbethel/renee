import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    const error = new Error('Missing required environment variables');
    error.code = 'ENV_MISSING';
    throw error;
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 2000,
    maxPoolSize: 5
  });
  isConnected = true;
}
