// src\services\sync-services\adAccountService.ts
import axios from 'axios';
import AuthMethod from '../../models/AuthMethod';
import AdAccount from '../../models/sync-models/AdAccountSync';
import BusinessManager from '../../models/sync-models/BmSync';

export async function syncAdAccounts(companyId: string, userId: string) {
  try {
    const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
    if (!auth?.accessToken) throw new Error('Facebook access token not found');

    const accessToken = auth.accessToken;

    const businessManagers = await BusinessManager.find({ companyId, userId });

    for (const bm of businessManagers) {
      const businessId = bm.businessId;

      const res = await axios.get(
        `https://graph.facebook.com/v22.0/${businessId}/owned_ad_accounts?fields=id,name,currency&access_token=${accessToken}`
      );

      const accounts = res.data?.data || [];

      for (const acct of accounts) {
        const doc = {
          adAccountId: acct.id,
          name: acct.name,
          currency: acct.currency,
          companyId,
          userId,
          businessId, // link to BM
        };

        const result = await AdAccount.updateOne(
          { adAccountId: acct.id },
          doc,
          { upsert: true }
        );

       // console.log(`📊 Synced Ad Account: ${acct.name} (${acct.id}) under BM ${businessId}`);
      //  console.log('📋 Mongo write result:', result);
      }
    }

   // console.log(`✅ Synced ad accounts from ${businessManagers.length} business managers`);
  } catch (err) {
    console.error(`❌ Failed to sync ad accounts for company ${companyId}`, err);
    throw err;
  }
}
