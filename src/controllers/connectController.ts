// src\controllers\connectController.ts
// src/controllers/connectController.ts
import { Request, Response } from 'express';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { saveAuthMethod } from '@/services/connectService';
import { UnauthorizedError } from '@/errors/Errors';

export const handleInstagramCallback = async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  if (!user) throw new UnauthorizedError();

  const { accessToken } = user;

  await saveAuthMethod({
    userId: user._id,
    companyId: user.companyId,
    type: 'instagram',
    accessToken,
    usedForLogin: false,
  });

  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

export const handleLinkedInCallback = async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  if (!user) throw new UnauthorizedError();

  const { accessToken } = user;

  await saveAuthMethod({
    userId: user._id,
    companyId: user.companyId,
    type: 'linkedin',
    accessToken,
    usedForLogin: false,
  });

  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

// Repeat for TikTok, Google Analytics, YouTube, etc.
