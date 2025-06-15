// src\controllers\connectController.ts
import { Request, Response } from 'express';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { UnauthorizedError } from '@/errors/Errors';

// 📦 Generic handler for platforms that don't need sync logic
async function handleConnectCallback(req: Request, res: Response, provider: string) {
  const user = (req as AuthUserReq).user;
  if (!user) throw new UnauthorizedError();

  // ✅ Just redirect; no token save needed for connect stage
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
}

// 🔹 Facebook
export const handleFacebookConnectCallback = (req: Request, res: Response) =>
  handleConnectCallback(req, res, 'facebook');

// 🔹 Instagram (with sync trigger)
export const handleInstagramConnectCallback = async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  if (!user) throw new UnauthorizedError();

  // ✅ Trigger Instagram data fetch
 
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
