// src\routes\campaignRoutes.ts
import express from 'express';
import { attachItemToCampaign } from '../controllers/campaignController';
import passport from 'passport';
const router = express.Router();

router.patch('/:id/item', passport.authenticate('jwt', { session: false }), attachItemToCampaign);

export default router;
