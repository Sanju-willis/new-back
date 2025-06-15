// src\controllers\signupController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { flowLog, dataLog } from '../utils/debuglog';
import { AuthUserReq } from '../interfaces/AuthUser';
import { UnauthorizedError } from '@/errors/Errors';

export const handleFacebookSignupCallback = async (req: Request, res: Response) => {
const user = (req as AuthUserReq).user;
  if (!user) throw new UnauthorizedError();

 //dataLog('1 Signup Flow Callback:', user);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
 // flowLog('🔄1 Auth Cookie  data:', token) ;

  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

export const handleInstagramSignupCallback = async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  if (!user) throw new UnauthorizedError();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};


