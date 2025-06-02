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
                const adAccJob = await syncQueue.add('sync-ad-accounts', { companyId, userId });

                queueEvents.once('completed', async ({ jobId }) => {
                  if (jobId === adAccJob.id) {
                    console.log('✅ sync-ad-accounts finished, now dispatching sync-campaigns');
                    const campaignsJob = await syncQueue.add('sync-campaigns', { companyId, userId });

                    queueEvents.once('completed', async ({ jobId }) => {
                      if (jobId === campaignsJob.id) {
                        console.log('✅ sync-campaigns finished, now dispatching sync-adsets');
                        const adSetsJob = await syncQueue.add('sync-adsets', { companyId, userId });

                        queueEvents.once('completed', async ({ jobId }) => {
                          if (jobId === adSetsJob.id) {
                            console.log('✅ sync-adsets finished, now dispatching sync-ads');
                            const adsJob = await syncQueue.add('sync-ads', { companyId, userId });

                            queueEvents.once('completed', async ({ jobId }) => {
                              if (jobId === adsJob.id) {
                                console.log('✅ sync-ads finished, now dispatching sync-ad-creatives');
                                const creativeJob = await syncQueue.add('sync-ad-creatives', { companyId, userId });

                                queueEvents.once('completed', async ({ jobId }) => {
                                  if (jobId === creativeJob.id) {
                                    console.log('✅ sync-ad-creatives finished, now dispatching sync-insights');
                                    await syncQueue.add('sync-insights', { companyId, userId });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
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