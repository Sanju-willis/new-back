// src\controllers\syncController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Company from '../models/Company';
import { AuthUserReq } from '../interfaces/AuthUser';

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
  const { name, industry, description } = req.body;

  if (!user?.companyId) {
    res.status(401).json({ message: 'Unauthorized or missing company ID' });
    return;
  }

  const updated = await Company.findByIdAndUpdate(
    user.companyId,
    { name, industry, description },
    { new: true }
  );

  res.json(updated); // ✅ Just call it, no `return`
});
