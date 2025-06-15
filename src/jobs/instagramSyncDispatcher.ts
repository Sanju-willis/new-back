// src\jobs\instagramSyncDispatcher.ts
import { syncQueue } from '../queues/syncQueue';
import { QueueEvents } from 'bullmq';
import { redisConnection } from '../config/redis';

const queueEvents = new QueueEvents('sync-queue', { connection: redisConnection });

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
    const profileJob = await syncQueue.add('sync-instagram-profile', {
      companyId,
      userId,
      accessToken,
      platformUserId,
    });

    // rest stays same...
  } catch (err) {
    console.error('❌ Instagram sync job dispatch failed:', err);
  }
}
