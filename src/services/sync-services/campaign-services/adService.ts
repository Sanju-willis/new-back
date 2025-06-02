// src\services\sync-services\campaign-services\adService.ts
import axios from 'axios';
import AuthMethod from '../../../models/AuthMethod';
import Ad from '../../../models/sync-models/campaign-sync/AdSync';
import AdAccount from '../../../models/sync-models/AdAccountSync';
import AdSet from '../../../models/sync-models/campaign-sync/AdSetSync';

export async function syncAds(companyId: string, userId: string) {
  const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
  if (!auth?.accessToken) throw new Error('Missing Facebook access token');
  const accessToken = auth.accessToken;

  const adAccounts = await AdAccount.find({ companyId, userId });
  if (!adAccounts.length) return;

  for (const acct of adAccounts) {
    const fbAdAccountId = acct.adAccountId.replace(/^act_/, '');
    const businessManagerId = acct.businessManagerId;

    const url = `https://graph.facebook.com/v18.0/act_${fbAdAccountId}/ads?fields=name,status,adset_id,creative&access_token=${accessToken}`;
    try {
      const { data } = await axios.get(url);

      for (const item of data.data) {
        const adSet = await AdSet.findOne({ adSetId: item.adset_id });
        if (!adSet) {
          console.warn(`⚠️ Skipping Ad ${item.id}: No AdSet found for ${item.adset_id}`);
          continue;
        }

        const doc = {
          adId: item.id,
          creativeId: item.creative?.id || '', // ✅ Save creativeId
          name: item.name,
          status: item.status,
          adSetId: adSet._id,
          adAccountId: acct._id,
          businessManagerId,
          companyId,
          userId,
        };

        await Ad.updateOne({ adId: item.id }, doc, { upsert: true });
        console.log(`📢 Synced Ad: ${item.name} (${item.id})`);
      }
    } catch (err: any) {
      console.error(`❌ Failed to fetch ads for adAccountId: ${fbAdAccountId}`, err?.response?.data || err.message);
    }
  }
}
