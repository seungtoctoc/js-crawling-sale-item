import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, { dbName: 'Sales' });
    console.log('db connected');
  } catch (err) {
    throw new Error('db connect error');
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('db disconnected');
  } catch (err) {
    throw new Error('db disconnect error');
  }
};
