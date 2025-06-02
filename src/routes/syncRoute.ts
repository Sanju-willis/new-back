// src\routes\syncRoute.ts
import express from 'express';
import passport from 'passport';
import {  getCompany, updateCompany, getItems, updateItem,} from '../controllers/syncController';

const router = express.Router();

router.get('/company', passport.authenticate('jwt', { session: false }), getCompany);
router.patch('/company', passport.authenticate('jwt', { session: false }), updateCompany);

router.get('/items', passport.authenticate('jwt', { session: false }), getItems);
router.patch('/items', passport.authenticate('jwt', { session: false }), updateItem); // Optional for future updates

export default router;
