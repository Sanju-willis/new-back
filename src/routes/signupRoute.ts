// src\routes\signupRoute.ts
import { Router, RequestHandler, Response } from 'express';
import passport from 'passport';
import { handleFacebookSignupCallback, handleInstagramSignupCallback } from '@/controllers/signupController';
import asyncHandler from 'express-async-handler';

const router = Router();

// 🔹 Facebook OAuth entry
router.get('/facebook', passport.authenticate('facebook-signup', {
  scope: [
    'email',
    'public_profile',
    'pages_show_list',
    'pages_read_engagement',
    'ads_management',
    'ads_read',
    'business_management',
    'pages_read_user_content',
    'pages_manage_metadata'
  ]
}));

// 🔹 Facebook callback handler
router.get(
  '/facebook/callback',
  passport.authenticate('facebook-signup', { session: false, failureRedirect: '/signup' }),
  asyncHandler(handleFacebookSignupCallback)
);

router.get('/instagram', passport.authenticate('instagram', {
  scope: [
    'email',
    'public_profile',
    'pages_show_list',
    'pages_read_engagement',
    'business_management',
    'instagram_basic',
    'instagram_manage_insights',
    'pages_manage_metadata'
  ]
}));

router.get('/instagram/callback',
  passport.authenticate('instagram', { session: false, failureRedirect: '/signup' }),
  asyncHandler(handleInstagramSignupCallback)
);



 export default router;
 