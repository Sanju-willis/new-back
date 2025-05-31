// src\services\sync-services\adAccountService.ts
import axios from 'axios';
import AuthMethod from '../../models/AuthMethod';
import AdAccount from '../../models/sync-models/AdAccountSync';

export async function syncAdAccounts(companyId: string, userId: string) {
  try {
    const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
    if (!auth?.accessToken) {
      throw new Error('Facebook access token not found for user');
    }

    const accessToken = auth.accessToken;

    const fbRes = await axios.get(
      `https://graph.facebook.com/v18.0/me/adaccounts?access_token=${accessToken}`
    );

    const adAccounts = fbRes.data?.data || [];

    for (const acct of adAccounts) {
      const acctData = {
        adAccountId: acct.id,
        name: acct.name,
        currency: acct.currency,
        companyId,
        userId,
      };

      const result = await AdAccount.updateOne(
        { adAccountId: acct.id },
        acctData,
        { upsert: true }
      );

      console.log(`📊 Synced Ad Account: ${acct.name} (${acct.id})`);
      console.log('📋 MongoDB write result:', result);
    }

    console.log(`✅ Total ${adAccounts.length} Ad Accounts synced for company ${companyId}`);

    return { adAccountsSynced: adAccounts.length };
  } catch (err) {
    console.error(`❌ Failed to sync Ad Accounts for company ${companyId}`, err);
    throw err;
  }
}
