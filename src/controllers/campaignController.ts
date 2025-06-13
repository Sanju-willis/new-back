// src\controllers\campaignController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { attachItemToCampaignById } from '@/services/campaignService';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { UnauthorizedError } from '@/errors/Errors';


export const attachItemToCampaign = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthUserReq).user;

  if (!user || !user._id || !user.companyId) {
    throw new UnauthorizedError();
  }

  const userId = user._id;
  const companyId = user.companyId;
  const campaignId = req.params.id;
  const { itemId } = req.body;

 // console.log('📦 PATCH /campaigns/:id/item', { userId, companyId, campaignId, itemId });

    const updated = await attachItemToCampaignById(campaignId, itemId, userId, companyId);
   
    res.json(updated);
  
});
