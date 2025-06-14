// src\routes\authRoute.ts
import { Router, RequestHandler, Response } from 'express';
import passport from 'passport';
import { handleFacebookCallback,handleInstagramCallback, handleLoginCheck } from '@/controllers/authController';
import asyncHandler from 'express-async-handler';

const router = Router();

// 🔹 Facebook OAuth entry
router.get('/facebook', passport.authenticate('facebook', {
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
  passport.authenticate('facebook', { session: false, failureRedirect: '/signup' }),
  asyncHandler(handleFacebookCallback)
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
  asyncHandler(handleInstagramCallback)
);


router.get('/login', passport.authenticate('jwt', { session: false }), handleLoginCheck);

 export default router;
 