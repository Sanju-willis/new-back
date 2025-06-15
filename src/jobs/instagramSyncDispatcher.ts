// src\jobs\instagramSyncDispatcher.ts
import { syncQueue } from '../queues/syncQueue';
import { QueueEvents } from 'bullmq';
import { redisConnection } from '../config/redis';

const queueEvents = new QueueEvents('sync-queue', { connection: redisConnection });

export async function instagramSyncDispatcher(companyId: string, userId: string) {
  try {
    console.log('🧾 Dispatching sync-instagram-profile...');
    const profileJob = await syncQueue.add('sync-instagram-profile', { companyId, userId });

    queueEvents.once('completed', async ({ jobId }) => {
      if (jobId === profileJob.id) {
        console.log('✅ sync-instagram-profile finished, now dispatching sync-instagram-media');
        const mediaJob = await syncQueue.add('sync-instagram-media', { companyId, userId });

        queueEvents.once('completed', async ({ jobId }) => {
          if (jobId === mediaJob.id) {
            console.log('✅ sync-instagram-media finished, now dispatching sync-instagram-insights');
            await syncQueue.add('sync-instagram-insights', { companyId, userId });
          }
        });
      }
    });
  } catch (err) {
    console.error('❌ Instagram sync job dispatch failed:', err);
  }
}
