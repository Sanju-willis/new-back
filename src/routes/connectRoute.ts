// src\routes\connectRoute.ts
import { Router } from 'express';
import passport from 'passport';
import asyncHandler from 'express-async-handler';

import {
  handleFacebookCallback,
  handleInstagramCallback,
  handleLinkedInCallback,
  handleTikTokCallback,
  handleGoogleAnalyticsCallback,
  handleYouTubeCallback,
} from '@/controllers/connectController';

const router = Router();

// 🔌 Facebook connection
router.get('/facebook', passport.authenticate('facebook-connect', {
  scope: [
    'pages_show_list',
    'pages_read_engagement',
    'ads_management',
    'ads_read',
    'business_management',
    'pages_read_user_content',
    'pages_manage_metadata'
  ]
}));

router.get('/facebook/callback',
  passport.authenticate('facebook-connect', { session: false }),
  asyncHandler(handleFacebookCallback)
);

// 🔌 Instagram
router.get('/instagram', passport.authenticate('instagram-connect', {
  scope: [
    'instagram_basic',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_manage_metadata',
    'business_management'
  ]
}));

router.get('/instagram/callback',
  passport.authenticate('instagram-connect', { session: false }),
  asyncHandler(handleInstagramCallback)
);

// 🔌 LinkedIn
router.get('/linkedin', passport.authenticate('linkedin-connect', {
  scope: ['r_emailaddress', 'r_liteprofile']
}));

router.get('/linkedin/callback',
  passport.authenticate('linkedin-connect', { session: false }),
  asyncHandler(handleLinkedInCallback)
);

// 🔌 TikTok
router.get('/tiktok', passport.authenticate('tiktok-connect', {
  scope: ['user.info.basic']
}));

router.get('/tiktok/callback',
  passport.authenticate('tiktok-connect', { session: false }),
  asyncHandler(handleTikTokCallback)
);

// 🔌 Google Analytics
router.get('/google_analytics', passport.authenticate('google-connect', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/analytics.readonly'
  ]
}));

router.get('/google_analytics/callback',
  passport.authenticate('google-connect', { session: false }),
  asyncHandler(handleGoogleAnalyticsCallback)
);

// 🔌 YouTube (Optional)
router.get('/youtube', passport.authenticate('youtube-connect', {
  scope: ['https://www.googleapis.com/auth/youtube.readonly']
}));

router.get('/youtube/callback',
  passport.authenticate('youtube-connect', { session: false }),
  asyncHandler(handleYouTubeCallback)
);

export default router;
