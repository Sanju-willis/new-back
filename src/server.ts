// src\server.ts
import dotenv from 'dotenv';
dotenv.config();

import { initRedis } from './config/redis'; // ✅ fixed import
import mongoose from 'mongoose';
import app from './app';

async function startServer() {
  await initRedis(); // ✅ fixed call

  await mongoose.connect(process.env.MONGO_URI!);
  console.log('✅ MongoDB Connected');

  app.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
  });
}

startServer().catch((err) => {
  console.error('❌ Server failed to start:', err);
});
