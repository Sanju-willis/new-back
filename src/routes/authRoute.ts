// src\routes\authRoute.ts
import { Router, RequestHandler, Response } from 'express';
import passport from 'passport';
import { handleFacebookCallback, handleLoginCheck } from '../controllers/authController';
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

router.get('/login', passport.authenticate('jwt', { session: false }), handleLoginCheck);

 export default router;
 