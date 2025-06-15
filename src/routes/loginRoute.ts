// src\routes\loginRoute.ts
// src\routes\authRoute.ts
import { Router, RequestHandler, Response } from 'express';
import passport from 'passport';
import asyncHandler from 'express-async-handler';
import { handleFacebookLoginCheck } from '@/controllers/loginController';

const router = Router();


router.get('/facebook', passport.authenticate('jwt', { session: false }), handleFacebookLoginCheck);

 export default router;
