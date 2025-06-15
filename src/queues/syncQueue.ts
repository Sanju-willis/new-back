// src\queues\syncQueue.ts
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const syncQueue = new Queue('sync-queue', {
  connection: redisConnection
});

// ✅ New queue for Instagram-specific jobs
export const instagramSyncQueue = new Queue('instagram-sync-queue', {
  connection: redisConnection
});