// src\controllers\campaignOverviewController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Campaign from '../models/sync-models/campaign-sync/CampaignSync';
import AdSet from '../models/sync-models/campaign-sync/AdSetSync';
import Ad from '../models/sync-models/campaign-sync/AdSync';
import AdCreative from '../models/sync-models/campaign-sync/AdCreativeSync';
import Insight from '../models/sync-models/campaign-sync/InsightSync';
import { AuthUserReq } from '../interfaces/AuthUser';

export const getCampaignOverview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthUserReq).user;

  if (!user || !user._id || !user.companyId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = user._id;
  const companyId = user.companyId;

  const [campaigns, adSets, ads, creatives, insights] = await Promise.all([
    Campaign.find({ companyId, userId }),
    AdSet.find({ companyId, userId }),
    Ad.find({ companyId, userId }),
    AdCreative.find({ companyId, userId }),
    Insight.find({ companyId, userId }),
  ]);

  res.json({ campaigns, adSets, ads, creatives, insights });
});
