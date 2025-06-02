// src\routes\campaignOverviewRoutes.ts
import express from 'express';
import passport from 'passport';
import { getCampaignOverview } from '../controllers/campaignOverviewController';

const router = express.Router();

router.get('/overview',passport.authenticate('jwt', { session: false }), getCampaignOverview);

export default router;
