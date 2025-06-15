// src\controllers\connectController.ts
import { Request, Response } from 'express';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { saveAuthMethod } from '@/services/connectService';
import { UnauthorizedError } from '@/errors/Errors';

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
export const handleInstagramConnectCallback = (req: Request, res: Response) =>
  handleConnectCallback(req, res, 'instagram');

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
