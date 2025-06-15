// src\jobs\instagramSyncDispatcher.ts
import { instagramSyncQueue } from '../queues/syncQueue';
import { QueueEvents } from 'bullmq';
import { redisConnection } from '../config/redis';

const queueEvents = new QueueEvents('instagram-sync-queue', {
  connection: redisConnection,
});

interface InstagramSyncPayload {
  companyId: string;
  userId: string;
  accessToken: string;
  platformUserId: string;
}

export async function instagramSyncDispatcher({
  companyId,
  userId,
  accessToken,
  platformUserId,
}: InstagramSyncPayload) {
  try {
    console.log('🧾 Dispatching sync-instagram-profile...');

    const profileJob = await instagramSyncQueue.add('sync-instagram-profile', {
      companyId,
      userId,
      accessToken,
      platformUserId,
    });

    queueEvents.once('completed', async ({ jobId }) => {
      if (jobId === profileJob.id) {
        console.log('✅ sync-instagram-profile finished, now dispatching sync-instagram-media');

        const mediaJob = await instagramSyncQueue.add('sync-instagram-media', {
          companyId,
          userId,
          accessToken,
          platformUserId,
        });

        queueEvents.once('completed', async ({ jobId }) => {
          if (jobId === mediaJob.id) {
            console.log('✅ sync-instagram-media finished, now dispatching sync-instagram-insights');

            await instagramSyncQueue.add('sync-instagram-insights', {
              companyId,
              userId,
              accessToken,
              platformUserId,
            });
          }
        });
      }
    });
  } catch (err) {
    console.error('❌ Instagram sync job dispatch failed:', err);
  }
}
