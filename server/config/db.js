import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prepgenius';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoUri} (${error.message}).`);
    console.warn(`[MongoDB Warning] PrepGenius AI server is running with resilient memory store fallback for local development without local MongoDB service.`);
    return false;
  }
};
