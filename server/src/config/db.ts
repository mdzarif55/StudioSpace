import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri !== 'mongodb://localhost:27017/studiospace') {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB via MONGODB_URI');
      return;
    } catch (err: any) {
      console.warn(`⚠️ Failed to connect to specified MONGODB_URI: ${err.message}. Falling back to embedded MongoMemoryServer...`);
    }
  }

  // Try localhost first if specified
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log('✅ Connected to local MongoDB instance');
      return;
    } catch {
      console.log('ℹ️ Local MongoDB daemon not reachable. Starting automatic MongoMemoryServer for zero-config execution...');
    }
  }

  // Fallback to high-speed embedded MongoMemoryServer
  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`✅ Connected to in-memory MongoDB (${memUri})`);
  } catch (err: any) {
    console.error('❌ Failed to start MongoMemoryServer:', err);
    throw err;
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

