// src\services\sync-services\campaign-services\campaignService.ts
import axios from 'axios';
import AuthMethod from '../../../models/AuthMethod';
import Campaign from '../../../models/sync-models/campaign-sync/CampaignSync';
import AdAccount from '../../../models/sync-models/AdAccountSync';

export async function syncCampaigns(companyId: string, userId: string) {
  const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
  if (!auth?.accessToken) throw new Error('Missing Facebook access token');

  const adAccounts = await AdAccount.find({ companyId, userId });
  if (!adAccounts.length) return console.warn('⚠️ No Ad Accounts found');

  for (const acct of adAccounts) {
    const fbId = acct.adAccountId.replace(/^act_/, '');
    const url = `https://graph.facebook.com/v18.0/act_${fbId}/campaigns?fields=name,objective,status,start_time,stop_time&access_token=${auth.accessToken}`;

    try {
      const { data } = await axios.get(url);
      if (!data?.data?.length) {
        console.warn(`⚠️ No campaigns for act_${fbId}`);
        continue;
      }

      for (const c of data.data) {
        await Campaign.updateOne(
          { campaignId: c.id },
          {
            campaignId: c.id,
            name: c.name,
            objective: c.objective,
            status: c.status,
            startTime: c.start_time ? new Date(c.start_time) : undefined,
            stopTime: c.stop_time ? new Date(c.stop_time) : undefined,
            adAccountId: acct._id,
            businessManagerId: acct.businessManagerId,
            companyId,
            userId,
          },
          { upsert: true }
        );
      //  console.log(`✅ Synced Campaign: ${c.name}`);
      }
    } catch (err: any) {
      console.error(`❌ Error syncing campaigns for ${fbId}:`, err?.response?.data || err.message);
    }
  }
}
