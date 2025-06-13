// src\services\campaignOverviewService.ts
import Campaign from '@/models/sync-models/campaign-sync/CampaignSync';
import AdSet from '@/models/sync-models/campaign-sync/AdSetSync';
import Ad from '@/models/sync-models/campaign-sync/AdSync';
import AdCreative from '@/models/sync-models/campaign-sync/AdCreativeSync';
import Insight from '@/models/sync-models/campaign-sync/InsightSync';

export async function getCampaignOverviewData(userId: string, companyId: string) {
  const [campaigns, adSets, ads, creatives, insights] = await Promise.all([
    Campaign.find({ companyId, userId }),
    AdSet.find({ companyId, userId }),
    Ad.find({ companyId, userId }),
    AdCreative.find({ companyId, userId }),
    Insight.find({ companyId, userId }),
  ]);

  return { campaigns, adSets, ads, creatives, insights };
}
