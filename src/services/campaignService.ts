// src\services\campaignService.ts
import{ Campaign } from '@/models';
import { BadRequestError, NotFoundError } from '@/errors/Errors';


export async function attachItemToCampaignById(
  campaignId: string,
  itemId: string,
  userId: string,
  companyId: string
) {
  if (!itemId) throw new BadRequestError('Missing itemId');

  const updated = await Campaign.findOneAndUpdate(
    { _id: campaignId, userId, companyId },
    { itemId },
    { new: true }
  );
 if (!updated) {
    throw new NotFoundError('Campaign not found or not owned by user');
  }
  return updated;
}
