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
    serverSelectionTimeoutMS: 10000, // 10 seconds for cold starts
    maxPoolSize: 10, // Modern limit
    socketTimeoutMS: 45000,
  };

  const connectWithRetry = async (retries = 3) => {
    try {
      return await mongoose.connect(process.env.MONGODB_URI, opts);
    } catch (err) {
      if (retries > 0) {
        console.warn(`DB connection failed, retrying... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return connectWithRetry(retries - 1);
      }
      throw err;
    }
  };

  cachedConnection = connectWithRetry().then(m => {
    return m;
  }).catch(err => {
    cachedConnection = null;
    throw err;
  });

  return cachedConnection;
}
