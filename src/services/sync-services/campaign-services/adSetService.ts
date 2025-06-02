// src\services\sync-services\campaign-services\adSetService.ts
import axios from 'axios';
import AuthMethod from '../../../models/AuthMethod';
import AdSet from '../../../models/sync-models/campaign-sync/AdSetSync';
import AdAccount from '../../../models/sync-models/AdAccountSync';
import Campaign from '../../../models/sync-models/campaign-sync/CampaignSync';

export async function syncAdSets(companyId: string, userId: string) {
  const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
  if (!auth?.accessToken) throw new Error('Missing Facebook access token');

  const adAccounts = await AdAccount.find({ companyId, userId });
  if (!adAccounts.length) return console.warn('⚠️ No Ad Accounts found');

  for (const acct of adAccounts) {
    const fbAdAccountId = acct.adAccountId.replace(/^act_/, '');
    const businessManagerId = acct.businessManagerId;

    const url = `https://graph.facebook.com/v18.0/act_${fbAdAccountId}/adsets?fields=name,status,daily_budget,campaign_id&access_token=${auth.accessToken}`;
    try {
      const { data } = await axios.get(url);

      for (const item of data.data) {
        // 🔍 Find matching Campaign document using FB ID
        const campaign = await Campaign.findOne({ campaignId: item.campaign_id });
        if (!campaign) {
          console.warn(`⚠️ Skipping Ad Set ${item.id}: No campaign found for ${item.campaign_id}`);
          continue;
        }

        const doc = {
          adSetId: item.id,
          name: item.name,
          status: item.status,
          dailyBudget: item.daily_budget,
          campaignId: campaign._id,           // ✅ Now using ObjectId
          adAccountId: acct._id,
          businessManagerId,
          companyId,
          userId,
        };

        await AdSet.updateOne({ adSetId: item.id }, doc, { upsert: true });
        console.log(`📊 Synced Ad Set: ${item.name} (${item.id})`);
      }
    } catch (err: any) {
      console.error(`❌ Failed to fetch ad sets for adAccountId: ${fbAdAccountId}`, err?.response?.data || err.message);
    }
  }
}
