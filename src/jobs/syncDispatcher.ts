// src\jobs\syncDispatcher.ts
import { syncQueue } from '../queues/syncQueue';

export async function syncDispatcher(companyId: string, userId: string) {
  try {
    console.log('🧾 Dispatching individual sync jobs to queue...');

    // First: sync pages
    await syncQueue.add('sync-pages', { companyId, userId });

    // Then: sync posts AFTER pages are queued
    await syncQueue.add('sync-posts', { companyId, userId });

    console.log(`✅ Sync jobs queued for company: ${companyId}`);
  } catch (err) {
    console.error(`❌ Failed to dispatch sync jobs for company ${companyId}`, err);
  }
}
