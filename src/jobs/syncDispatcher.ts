// src/jobs/syncDispatcher.ts
import { Queue, Job } from 'bullmq';
import { redisConnection } from '../config/redis';

const syncQueue = new Queue('sync-queue', { connection: redisConnection });

export async function syncDispatcher(companyId: string, userId: string) {
  try {
    console.log('🧾 Dispatching sync-pages job...');

    const jobId = `pages-${companyId}`;
    await syncQueue.add('sync-pages', { companyId, userId }, { jobId });

    // ✅ Wait until Redis confirms the parent job is stored
    let retries = 10;
    while (retries-- > 0) {
      const exists = await Job.fromId(syncQueue, jobId);
      if (exists) break;
      await new Promise(res => setTimeout(res, 100));
    }

    console.log('✅ sync-pages job confirmed, now adding sync-posts...');

    await syncQueue.add('sync-posts', { companyId, userId }, {
      jobId: `posts-${companyId}`,
      parent: {
        id: jobId,
        queue: 'sync-queue'
      }
    });

    console.log(`✅ Posts will run after pages for company: ${companyId}`);
  } catch (err) {
    console.error(`❌ Failed to dispatch jobs for ${companyId}`, err);
  }
}
