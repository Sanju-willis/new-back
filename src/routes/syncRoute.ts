// src\routes\syncRoute.ts
import express from 'express';
import passport from 'passport';
import { getCompany } from '../controllers/syncController';

const router = express.Router();

router.get('/company', passport.authenticate('jwt', { session: false }), getCompany);

export default router;
