// src\queues\syncQueue.ts
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const syncQueue = new Queue('sync-queue', {
  connection: redisConnection,
});
