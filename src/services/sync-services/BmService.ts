// src\services\sync-services\BmService.ts
import axios from 'axios';
import AuthMethod from '../../models/AuthMethod';
import BusinessManager from '../../models/sync-models/BmSync';

export async function syncBusinessManager(companyId: string, userId: string) {
  try {
    const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
    if (!auth?.accessToken) throw new Error('Facebook access token not found');
    const accessToken = auth.accessToken;

    const bmRes = await axios.get(
      `https://graph.facebook.com/v22.0/me/businesses?access_token=${accessToken}`
    );

    const businesses = bmRes.data?.data || [];

    for (const biz of businesses) {
      const businessId = biz.id;

      // 🔄 Get Ad Accounts under this Business
      const adAccountsRes = await axios.get(
        `https://graph.facebook.com/v22.0/${businessId}/owned_ad_accounts?fields=id,name,currency&access_token=${accessToken}`
      );

      // 🔄 Get Pages under this Business
      const pagesRes = await axios.get(
        `https://graph.facebook.com/v22.0/${businessId}/owned_pages?fields=id,name,category&access_token=${accessToken}`
      );

      const adAccounts = adAccountsRes.data?.data || [];
      const pages = pagesRes.data?.data || [];

      const bmData = {
        businessId,
        name: biz.name,
        adAccounts,
        pages,
        companyId,
        userId,
      };

      const result = await BusinessManager.updateOne(
        { businessId },
        bmData,
        { upsert: true }
      );

     // console.log(`🏢 Synced BM: ${biz.name} (${businessId})`);
     // console.log('📋 Mongo result:', result);
    }

  //  console.log(`✅ Total ${businesses.length} BMs synced`);
    return { businessManagersSynced: businesses.length };

  } catch (err) {
    console.error(`❌ Failed to sync BMs for company ${companyId}`, err);
    throw err;
  }
}
