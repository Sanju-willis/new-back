// src\services\sync-services\campaign-services\insightService.ts
import axios from 'axios';
import { AuthMethod, Insight, Ad, AdSet, Campaign } from '@/models';

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
          fields: [
            'ad_name',
            'impressions',
            'clicks',
            'ctr',
            'cpc',
            'cpm',
            'spend',
            'reach',
            'frequency',
            'conversions',
            'conversion_values',
            'quality_ranking',
            'engagement_rate_ranking',
            'date_start',
            'date_stop',
          ].join(','),
          date_preset: 'maximum',
        },
      });

      const insight = data.data?.[0];
      if (!insight) {
        console.warn(`⚠️ No insight for Ad ${ad.adId}`);
        continue;
      }

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
        reach: parseInt(insight.reach || '0'),
        frequency: parseFloat(insight.frequency || '0'),
        ctr: parseFloat(insight.ctr || '0'),
        cpc: parseFloat(insight.cpc || '0'),
        cpm: parseFloat(insight.cpm || '0'),
        conversions: parseInt(insight.conversions || '0'),
        conversionValue: parseFloat(insight.conversion_values || '0'),
        qualityRanking: insight.quality_ranking || null,
        engagementRateRanking: insight.engagement_rate_ranking || null,
        date: new Date(insight.date_start),
        companyId,
        userId,
      };

      await Insight.updateOne(
        { adId: ad._id, date: doc.date },
        doc,
        { upsert: true }
      );

    } catch (err: any) {
      console.error(`❌ Failed to sync insights for Ad ${ad.adId}`, err?.response?.data || err.message);
    }
  }
}
