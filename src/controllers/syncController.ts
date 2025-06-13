// src\controllers\syncController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Company from '../models/Company';
import { AuthUserReq } from '../interfaces/AuthUser';
import Item from '../models/Items'; 


export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  console.log('[🔐 getCompany] user:', user);

  if (!user || !user._id || !user.companyId) {
    console.log('[❌ getCompany] Unauthorized or no companyId');
    res.status(401).json({ message: 'Unauthorized or missing companyId' });
    return;
  }

  const company = await Company.findById(user.companyId);

  if (!company) {
    console.log('[❌ getCompany] Company not found for ID:', user.companyId);
    res.status(404).json({ message: 'Company not found' });
    return;
  }

  console.log('[✅ getCompany] Found company:', company.name);
  res.json(company);
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;

  if (!user?.companyId) {
    res.status(401).json({ message: 'Unauthorized or missing company ID' });
    return;
  }

  const { name, industry, size, type, targetMarket, address, website, description, brandGuideUrl, logoAssetsUrl, pressKitUrl,
    portfolioUrl,contentLibraryUrl, socialLinks, productPages,} = req.body;

  const updated = await Company.findByIdAndUpdate(
    user.companyId,
    {
      name, industry, size, type, targetMarket, address, website, description, brandGuideUrl, logoAssetsUrl, pressKitUrl,
      portfolioUrl, contentLibraryUrl, socialLinks: socialLinks?.filter(Boolean), productPages: productPages?.filter(Boolean),
    },
    { new: true }
  );

  res.json(updated);
});
export const getItems = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;

   if (!user?.companyId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const items = await Item.find({ companyId: user.companyId }).sort({ createdAt: -1 });
  res.json(items);
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  const {_id, name, type, description, category, features, mainBenefits, painPoints, useCases, pricePositioning,
    targetAudience, topCompetitors, uniqueSellingPoints} = req .body;

   if (!user?.companyId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (!_id || !name || !type) {
     res.status(400).json({ message: 'Missing item ID, name, or type' });
     return;
  }

  const updatePayload = {name, type, description, category, features, mainBenefits, painPoints, useCases,
    pricePositioning,  targetAudience,  topCompetitors,  uniqueSellingPoints };

  const updatedItem = await Item.findOneAndUpdate(
    { _id, companyId: user.companyId },
    updatePayload,
    { new: true }
  );

  if (!updatedItem) {
     res.status(404).json({ message: 'Item not found or unauthorized' });
     return;
  }

  res.json(updatedItem);
});
