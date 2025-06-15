// src\server.ts
import dotenv from 'dotenv';
dotenv.config();


import mongoose from 'mongoose';
import app from './app';

// 🛠️ Start the BullMQ worker
import './workers/syncWorker';
import '@/workers/instagramWorker'; 


async function startServer() {

  await mongoose.connect(process.env.MONGO_URI!);
  console.log('✅ MongoDB Connected');

  app.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
  });
}

startServer().catch((err) => {
  console.error('❌ Server failed to start:', err);
});
