// src\routes\connectRoute.ts
import { Router } from 'express';
import passport from 'passport';
import asyncHandler from 'express-async-handler';

import {
  handleFacebookConnectCallback,
  handleInstagramConnectCallback,
  handleLinkedInConnectCallback,
  handleTikTokConnectCallback,
  handleYouTubeConnectCallback,
  handleGoogleAnalyticsConnectCallback
} from '@/controllers/connectController';

const router = Router();
const requireUser = passport.authenticate('jwt', { session: false });

// 🔌 Facebook
router.get( '/facebook', requireUser,
  passport.authenticate('facebook-connect', {
    scope: [
      'pages_show_list',
      'pages_read_engagement',
      'ads_management',
      'ads_read',
      'business_management',
      'pages_read_user_content',
      'pages_manage_metadata',
    ],
  })
);
router.get( '/facebook/callback', passport.authenticate('facebook-connect', { session: false }),
  asyncHandler(handleFacebookConnectCallback)
);

// 🔌 Instagram
router.get(
  '/instagram',
  requireUser,
  passport.authenticate('instagram-connect', {
    scope: [
       'instagram_basic',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
    'pages_read_user_content',
    'business_management',
    ],
  })
);
router.get(
  '/instagram/callback',
  passport.authenticate('instagram-connect', { session: false }), // 1️⃣ Handle Instagram login
  passport.authenticate('jwt', { session: false }),               // 2️⃣ Decode JWT cookie
  asyncHandler(handleInstagramConnectCallback)                    // 3️⃣ Now req.user is available
);


// 🔌 LinkedIn
router.get(
  '/linkedin',
  requireUser,
  passport.authenticate('linkedin-connect', {
    scope: ['r_emailaddress', 'r_liteprofile'],
  })
);
router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin-connect', { session: false }),
  asyncHandler(handleLinkedInConnectCallback)
);

// 🔌 TikTok
router.get(
  '/tiktok',
  requireUser,
  passport.authenticate('tiktok-connect', {
    scope: ['user.info.basic'],
  })
);
router.get(
  '/tiktok/callback',
  passport.authenticate('tiktok-connect', { session: false }),
  asyncHandler(handleTikTokConnectCallback)
);

// 🔌 Google Analytics
router.get(
  '/google_analytics',
  requireUser,
  passport.authenticate('google-connect', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/analytics.readonly',
    ],
  })
);
router.get(
  '/google_analytics/callback',
  passport.authenticate('google-connect', { session: false }),
  asyncHandler(handleGoogleAnalyticsConnectCallback)
);

// 🔌 YouTube
router.get(
  '/youtube',
  requireUser,
  passport.authenticate('youtube-connect', {
    scope: ['https://www.googleapis.com/auth/youtube.readonly'],
  })
);
router.get(
  '/youtube/callback',
  passport.authenticate('youtube-connect', { session: false }),
  asyncHandler(handleYouTubeConnectCallback)
);

export default router;
