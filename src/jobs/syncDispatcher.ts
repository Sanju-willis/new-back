// src\jobs\syncDispatcher.ts
import { syncQueue } from '../queues/syncQueue';
import { QueueEvents } from 'bullmq';
import { redisConnection } from '../config/redis';

const queueEvents = new QueueEvents('sync-queue', { connection: redisConnection });

export async function syncDispatcher(companyId: string, userId: string) {
  try {
    console.log('🧾 Dispatching sync-pages...');

    const pageJob = await syncQueue.add('sync-pages', { companyId, userId });

    queueEvents.once('completed', async ({ jobId }) => {
      if (jobId === pageJob.id) {
        console.log('✅ sync-pages finished, now dispatching sync-posts');
        const postJob = await syncQueue.add('sync-posts', { companyId, userId });

        queueEvents.once('completed', async ({ jobId }) => {
          if (jobId === postJob.id) {
            console.log('✅ sync-posts finished, now dispatching sync-business');
            const businessJob = await syncQueue.add('sync-business', { companyId, userId });

            queueEvents.once('completed', async ({ jobId }) => {
              if (jobId === businessJob.id) {
                console.log('✅ sync-business finished, now dispatching sync-ad-accounts');
                await syncQueue.add('sync-ad-accounts', { companyId, userId });
              }
            });
          }
        });
      }
    });
  } catch (err) {
    console.error('❌ Job dispatch failed:', err);
  }
}
