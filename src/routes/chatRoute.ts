// src\routes\chatRoute.ts
import { dataLog } from '../utils/debuglog';
import express from 'express';
import passport from 'passport';
import { getAssistantReplyController } from '../controllers/chatController';

const router = express.Router();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
   // dataLog('🛬 [POST /chat] Incoming body:', req.body);
  //  dataLog('🔐 Authenticated user:', req.user);
    next();
  },
  getAssistantReplyController
);

export default router;
