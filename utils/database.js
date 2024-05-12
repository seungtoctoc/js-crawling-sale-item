import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO, { dbName: 'Sales' });
    console.log('db connected');
  } catch (err) {
    console.log('error in connectDB, ', err);
  }
}

export function disconnectDB() {
  try {
    mongoose.disconnect();
    console.log('db disconnected');
  } catch (err) {
    console.log('error in disconnectDB, ', err);
  }
}
