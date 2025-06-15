// src\controllers\onboardController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { AuthUserReq } from '../interfaces/AuthUser';
import { createBasicCompany } from '../services/onboardService';
import { syncDispatcher } from '../jobs/syncDispatcher';
import {UnauthorizedError } from '@/errors/Errors';

export const createCompanyController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as Request & AuthUserReq).user;
    if (!user) throw new UnauthorizedError();

  const {
  companyName,
  industry,
  size,
  type,
  target_market,
  address,
  website,
  socialLinks,
  brandGuideUrl,
  logoAssetsUrl,
  pressKitUrl,
  portfolioUrl,
  contentLibraryUrl,
  productPages,
  description,
  role,
  items
} = req.body;

   const { company, progress, platforms  } = await createBasicCompany(user._id, {
  companyName,
  industry,
  size,
  type,
  target_market,
  address,
  website,
  socialLinks,
  brandGuideUrl,
  logoAssetsUrl,
  pressKitUrl,
  portfolioUrl,
  contentLibraryUrl,
  productPages,
  description,
  role,
  items
});

    // 🔁 Start syncing process
    syncDispatcher(company._id.toString(), user._id.toString());

    // 🔐 Create new JWT with companyId
    const token = jwt.sign(
      {
        id: user._id,
        companyId: company._id.toString(),
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // 🍪 Set updated token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Respond with company and progress
res.status(201).json({ company, progress, platforms });
 
});
