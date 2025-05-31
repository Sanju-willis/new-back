// src/workers/syncWorker.ts
import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { syncFacebookPages } from '../services/sync-services/pageService';
import { syncUserPosts } from '../services/sync-services/postService';
import { syncBusinessManager } from '../services/sync-services/BmService';
import { syncAdAccounts } from '../services/sync-services/adAccountService';

console.log('🛠️ Sync Worker started and listening for jobs...');

new Worker('sync-queue', async (job) => {
  const { name, data } = job;

  console.log(`📦 Received job: ${name}`, data);

  if (name === 'sync-pages') {
    console.log(`🔄 Syncing Facebook pages for company: ${data.companyId}`);
    await syncFacebookPages(data.companyId, data.userId);
    console.log('✅ Pages sync complete');
  }

  if (name === 'sync-posts') {
    console.log(`📝 Syncing posts for company: ${data.companyId}`);
    await syncUserPosts(data.companyId, data.userId);
    console.log('✅ Posts sync complete');
  }

  if (name === 'sync-business') {
    console.log(`🏢 Syncing Business Managers for company: ${data.companyId}`);
    await syncBusinessManager(data.companyId, data.userId);
    console.log('✅ Business Manager sync complete');
  }

  if (name === 'sync-ad-accounts') {
    console.log(`📊 Syncing Ad Accounts for company: ${data.companyId}`);
    await syncAdAccounts(data.companyId, data.userId);
    console.log('✅ Ad Account sync complete');
  }
}, {
  connection: redisConnection,
  concurrency: 1,
  lockDuration: 300000,
  useWorkerThreads: false,
});
