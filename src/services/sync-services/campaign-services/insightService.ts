// src\services\sync-services\campaign-services\insightService.ts

import axios from 'axios';
import AuthMethod from '../../../models/AuthMethod';
import Insight from '../../../models/sync-models/campaign-sync/InsightSync';
import Ad from '../../../models/sync-models/campaign-sync/AdSync';
import AdSet from '../../../models/sync-models/campaign-sync/AdSetSync';
import Campaign from '../../../models/sync-models/campaign-sync/CampaignSync';

export async function syncInsights(companyId: string, userId: string) {
  const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
  if (!auth?.accessToken) throw new Error('Missing Facebook access token');
  const accessToken = auth.accessToken;

  const ads = await Ad.find({ companyId, userId });
  if (!ads.length) return console.warn('⚠️ No Ads found');

  for (const ad of ads) {
    try {
      const url = `https://graph.facebook.com/v22.0/${ad.adId}/insights`;
      const { data } = await axios.get(url, {
        params: {
          access_token: accessToken,
          fields: 'impressions,clicks,spend,date_start',
          date_preset: 'maximum',
        },
      });

      const insight = data.data?.[0];
      if (!insight) {
        console.warn(`⚠️ No insight for Ad ${ad.adId}`);
        continue;
      }

      // Fetch AdSet to get campaignId
      const adSet = await AdSet.findById(ad.adSetId);
      if (!adSet) {
        console.warn(`⚠️ AdSet not found for Ad ${ad.adId}`);
        continue;
      }

      const campaign = await Campaign.findById(adSet.campaignId);
      if (!campaign) {
        console.warn(`⚠️ Campaign not found for Ad ${ad.adId}`);
        continue;
      }

      const doc = {
        adId: ad._id,
        adSetId: adSet._id,
        campaignId: campaign._id,
        adAccountId: ad.adAccountId,
        businessManagerId: ad.businessManagerId,
        impressions: parseInt(insight.impressions || '0'),
        clicks: parseInt(insight.clicks || '0'),
        spend: parseFloat(insight.spend || '0'),
        date: new Date(insight.date_start),
        companyId,
        userId,
      };

      await Insight.updateOne(
        { adId: ad._id, date: doc.date },
        doc,
        { upsert: true }
      );

      console.log(`📈 Synced Insight for Ad ${ad.adId} (${doc.date.toDateString()})`);
    } catch (err: any) {
      console.error(`❌ Failed to sync insights for Ad ${ad.adId}`, err?.response?.data || err.message);
    }
  }
}
