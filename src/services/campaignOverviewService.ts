// src\services\campaignOverviewService.ts
import { Campaign, AdSet, Ad, AdCreative, Insight } from '@/models';


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
