import mongoose from 'mongoose';

let cachedConnection = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (cachedConnection) return cachedConnection;

  if (!process.env.MONGODB_URI) {
    const error = new Error('Missing MONGODB_URI environment variable');
    error.code = 'ENV_MISSING';
    throw error;
  }

  const opts = {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 1
  };

  cachedConnection = mongoose.connect(process.env.MONGODB_URI, opts).then(m => {
    return m;
  }).catch(err => {
    cachedConnection = null;
    throw err;
  });

  return cachedConnection;
}
