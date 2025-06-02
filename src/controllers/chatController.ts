// src\controllers\chatController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { assistantReply } from '../services/chatService';
import { AuthUserReq } from '../interfaces/AuthUser';
import {dataLog } from '../utils/debuglog';

export const getAssistantReplyController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as Request & AuthUserReq ).user;

 // dataLog('➡️  🟢-ai req input:', req.body, user)

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { input = '', stage = '', step = '' } = req.body;

  const result = await assistantReply({  msg: input, stage, step, user });
    //dataLog('➡️  🔴- ai reply :',{result} )

  res.json(result);
});
