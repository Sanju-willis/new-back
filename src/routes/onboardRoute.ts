// src\routes\onboardRoute.ts
import passport from 'passport';
import { Router, Response } from 'express';
import { createCompanyController } from '../controllers/onboardController';

const router = Router();

router.post('/company',passport.authenticate('jwt', { session: false }), createCompanyController );

export default router;