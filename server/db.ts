import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (isConnected) {
    return true;
  }

  const rawUri = process.env.MONGODB_URI || 'mongodb+srv://puneetk49081_db_user:<db_password>@cluster0.oq6h0ge.mongodb.net/adivasetu?retryWrites=true&w=majority';

  if (!rawUri || rawUri.includes('<db_password>')) {
    console.warn('\n⚠️  [MongoDB Atlas Alert]');
    console.warn('   The MONGODB_URI contains the placeholder "<db_password>".');
    console.warn('   Please provide your real MongoDB user password in the .env file:');
    console.warn('   MONGODB_URI=mongodb+srv://puneetk49081_db_user:YOUR_PASSWORD@cluster0.oq6h0ge.mongodb.net/adivasetu?retryWrites=true&w=majority\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB Atlas] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.error(`❌ [MongoDB Atlas] Connection failed: ${error.message}`);
    return false;
  }
};
