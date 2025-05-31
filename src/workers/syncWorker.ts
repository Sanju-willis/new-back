// src\workers\syncWorker.ts
import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { syncFacebookPages } from '../services/sync-services/pageService';

const worker = new Worker(  'sync',  async job => {
    const { companyId, userId } = job.data;
    await syncFacebookPages(companyId, userId);
  },
  { connection: redisConnection }
);

worker.on('completed', job => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
