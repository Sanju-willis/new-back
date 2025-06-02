// src\routes\syncRoute.ts
import express from 'express';
import passport from 'passport';
import { getCompany, updateCompany } from '../controllers/syncController';


const router = express.Router();

router.get('/company', passport.authenticate('jwt', { session: false }), getCompany);
router.patch('/company', passport.authenticate('jwt', { session: false }), updateCompany);

export default router;
