// src\services\campaignService.ts
import Campaign from '@/models/sync-models/campaign-sync/CampaignSync';

export async function attachItemToCampaignById(
  campaignId: string,
  itemId: string,
  userId: string,
  companyId: string
) {
  if (!itemId) throw new Error('Missing itemId');

  const updated = await Campaign.findOneAndUpdate(
    { _id: campaignId, userId, companyId },
    { itemId },
    { new: true }
  );

  return updated;
}
