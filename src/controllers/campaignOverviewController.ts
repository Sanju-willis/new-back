// src\controllers\campaignOverviewController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getCampaignOverviewData } from '@/services/campaignOverviewService';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { UnauthorizedError } from '@/errors/Errors';


export const getCampaignOverview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthUserReq).user;

  if (!user || !user._id || !user.companyId) {
    throw new UnauthorizedError();
  }


  const data = await getCampaignOverviewData(user._id, user.companyId);
  res.json(data);
});
