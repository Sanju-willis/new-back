// src\jobs\syncDispatcher.ts
import { syncFacebookPages } from '../services/sync-services/pageService';
// import other sync services like syncAdAccounts, syncCampaigns, etc.

export async function syncDispatcher(companyId: string, userId: string) {
  try {
    // 🔄 Sync each service
    await syncFacebookPages(companyId, userId);
    // await syncAdAccounts(companyId);
    // await syncCampaigns(companyId);
    // Add more syncs here...

    console.log(`✅ Sync completed for company: ${companyId}`);
  } catch (err) {
    console.error(`❌ Sync failed for company: ${companyId}`, err);
  }
}
