// src\workers\syncWorker.ts
import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { syncFacebookPages } from '../services/sync-services/pageService';
import { syncUserPosts } from '../services/sync-services/postService';

console.log('🛠️ Sync Worker started and listening for jobs...');

new Worker('sync-queue', async (job) => {
  const { name, data } = job;

  console.log(`📦 Received job: ${name}`, data);

  if (name === 'sync-pages') {
    console.log(`🔄 Syncing Facebook pages for company: ${data.companyId}`);
    await syncFacebookPages(data.companyId, data.userId);
  }

  if (name === 'sync-posts') {
    console.log(`📝 Syncing posts for company: ${data.companyId}`);
    await syncUserPosts(data.companyId, data.userId);
  }
}, {
  connection: redisConnection, // ✅ Using the ioredis instance
  concurrency: 5,
});
