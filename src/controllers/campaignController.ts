// src\controllers\campaignController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { attachItemToCampaignById } from '@/services/campaignService';
import { AuthUserReq } from '@/interfaces/AuthUser';

export const attachItemToCampaign = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthUserReq).user;

  if (!user || !user._id || !user.companyId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = user._id;
  const companyId = user.companyId;
  const campaignId = req.params.id;
  const { itemId } = req.body;

  console.log('📦 PATCH /campaigns/:id/item', { userId, companyId, campaignId, itemId });

  try {
    const updated = await attachItemToCampaignById(campaignId, itemId, userId, companyId);
    if (!updated) {
      res.status(404).json({ error: 'Campaign not found or not owned by user' });
      return;
    }

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
