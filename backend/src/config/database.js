import dns from 'node:dns';
import mongoose from 'mongoose';

// Some ISPs/routers block SRV lookups; use public DNS for the MongoDB connection lookup.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected');
}