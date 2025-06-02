// src\workers\syncWorker.ts
import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';

import { syncFacebookPages } from '../services/sync-services/pageService';
import { syncUserPosts } from '../services/sync-services/postService';
import { syncBusinessManager } from '../services/sync-services/BmService';
import { syncAdAccounts } from '../services/sync-services/adAccountService';
import { syncCampaigns } from '../services/sync-services/campaign-services/campaignService';
import { syncAdSets } from '../services/sync-services/campaign-services/adSetService';
import { syncAds } from '../services/sync-services/campaign-services/adService';
import { syncAdCreatives } from '../services/sync-services/campaign-services/adCreativeService';
import { syncInsights } from '../services/sync-services/campaign-services/insightService';

console.log('🛠️ Sync Worker started and listening for jobs...');

new Worker('sync-queue', async (job) => {
  const { name, data } = job;

  console.log(`📦 Received job: ${name}`, data);

  switch (name) {
    case 'sync-pages':
      console.log(`🔄 Syncing Facebook pages for company: ${data.companyId}`);
      await syncFacebookPages(data.companyId, data.userId);
      console.log('✅ Pages sync complete');
      break;

    case 'sync-posts':
      console.log(`📝 Syncing posts for company: ${data.companyId}`);
      await syncUserPosts(data.companyId, data.userId);
      console.log('✅ Posts sync complete');
      break;

    case 'sync-business':
      console.log(`🏢 Syncing Business Managers for company: ${data.companyId}`);
      await syncBusinessManager(data.companyId, data.userId);
      console.log('✅ Business Manager sync complete');
      break;

    case 'sync-ad-accounts':
      console.log(`📊 Syncing Ad Accounts for company: ${data.companyId}`);
      await syncAdAccounts(data.companyId, data.userId);
      console.log('✅ Ad Account sync complete');
      break;

    case 'sync-campaigns':
      console.log(`📢 Syncing Campaigns for company: ${data.companyId}`);
      await syncCampaigns(data.companyId, data.userId);
      console.log('✅ Campaigns sync complete');
      break;

    case 'sync-adsets':
      console.log(`📈 Syncing Ad Sets for company: ${data.companyId}`);
      await syncAdSets(data.companyId, data.userId);
      console.log('✅ Ad Sets sync complete');
      break;

    case 'sync-ads':
      console.log(`🎯 Syncing Ads for company: ${data.companyId}`);
      await syncAds(data.companyId, data.userId);
      console.log('✅ Ads sync complete');
      break;

    case 'sync-ad-creatives':
      console.log(`🎨 Syncing Ad Creatives for company: ${data.companyId}`);
      await syncAdCreatives(data.companyId, data.userId);
      console.log('✅ Ad Creatives sync complete');
      break;

    case 'sync-insights':
      console.log(`📊 Syncing Insights for company: ${data.companyId}`);
      await syncInsights(data.companyId, data.userId);
      console.log('✅ Insights sync complete');
      break;

    default:
      console.warn(`⚠️ Unknown job name: ${name}`);
      break;
  }
}, {
  connection: redisConnection,
  concurrency: 1,
  lockDuration: 300000,
  useWorkerThreads: false,
});
