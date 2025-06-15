// src\workers\instagramWorker.ts
import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { fetchInstagramProfile, fetchInstagramMedia, fetchInstagramInsights } from '@/services/sync-services/instagramService';

export const instagramWorker = new Worker(
  'sync-queue',
  async job => {
    const { name, data } = job;

    switch (name) {
      case 'sync-instagram-profile':
        console.log('📥 Syncing Instagram profile...');
        await fetchInstagramProfile(data);
        break;

      case 'sync-instagram-media':
        console.log('🖼️ Syncing Instagram media...');
        await fetchInstagramMedia(data);
        break;

      case 'sync-instagram-insights':
        console.log('📊 Syncing Instagram insights...');
        await fetchInstagramInsights(data);
        break;

      default:
        console.warn(`⚠️ Unknown job: ${name}`);
    }
  },
  { connection: redisConnection }
);
