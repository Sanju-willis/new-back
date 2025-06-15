// src\controllers\connectController.ts
import { Request, Response } from 'express';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { saveAuthMethod } from '@/services/connectService';
import { UnauthorizedError } from '@/errors/Errors';
import { instagramSyncDispatcher } from '@/jobs/instagramSyncDispatcher';


async function handleConnectCallback(req: Request, res: Response, provider: string) {
  const user = (req as AuthUserReq).user;
  if (!user) throw new UnauthorizedError();

  const { accessToken } = user;

  await saveAuthMethod({
    userId: user._id,
    companyId: user.companyId,
    type: provider,
    accessToken,
    usedForLogin: false,
  });

  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
}

// 🔹 Facebook
export const handleFacebookConnectCallback = (req: Request, res: Response) =>
  handleConnectCallback(req, res, 'facebook');

// 🔹 Instagram
export const handleInstagramConnectCallback = async (req: Request, res: Response) => {
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

  // ✅ Trigger Instagram data fetch
await instagramSyncDispatcher(user.companyId, user._id);

  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};
// 🔹 LinkedIn
export const handleLinkedInConnectCallback = (req: Request, res: Response) =>
  handleConnectCallback(req, res, 'linkedin');

// 🔹 TikTok
export const handleTikTokConnectCallback = (req: Request, res: Response) =>
  handleConnectCallback(req, res, 'tiktok');

// 🔹 YouTube
export const handleYouTubeConnectCallback = (req: Request, res: Response) =>
  handleConnectCallback(req, res, 'youtube');

// 🔹 Google Analytics
export const handleGoogleAnalyticsConnectCallback = (req: Request, res: Response) =>
  handleConnectCallback(req, res, 'google-analytics');
