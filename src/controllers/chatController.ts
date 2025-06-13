// src\controllers\chatController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { assistantReply } from '../services/chatService';
import { AuthUserReq } from '../interfaces/AuthUser';
import { UnauthorizedError } from '@/errors/Errors';


export const getAssistantReplyController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as Request & AuthUserReq ).user;

 // dataLog('➡️  🟢-ai req input:', req.body, user)

   if (!user) throw new UnauthorizedError();


  const { input = '', stage = '', step = '' } = req.body;

  const result = await assistantReply({  msg: input, stage, step, user });
    //dataLog('➡️  🔴- ai reply :',{result} )

  res.json(result);
});
