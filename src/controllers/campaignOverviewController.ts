// src/controllers/campaignOverviewController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getCampaignOverviewData } from '@/services/campaignOverviewService';
import { AuthUserReq } from '@/interfaces/AuthUser';

export const getCampaignOverview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthUserReq).user;

  if (!user || !user._id || !user.companyId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const data = await getCampaignOverviewData(user._id, user.companyId);
  res.json(data);
});
