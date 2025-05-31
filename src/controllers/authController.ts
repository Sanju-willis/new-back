// src\controllers\authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { flowLog, dataLog } from '../utils/debuglog';
import { getLoginResponse } from '../services/authService';
import { AuthUserReq } from '../interfaces/AuthUser';

export const handleFacebookCallback = async (req: Request, res: Response) => {
const user = (req as AuthUserReq).user;

 // dataLog('1 Signup Flow Callback:', user);

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



export async function handleLoginCheck(req: Request, res: Response): Promise<void> {
  const { user } = req as AuthUserReq;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { company, progress, user: userDoc } = await getLoginResponse(user._id);

  if (!userDoc) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // ✅ Add companyId if available
  const payload = {
    id: userDoc._id,
    ...(company && { companyId: company._id.toString() }),
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const responsePayload = {
    user: {
      name: userDoc.name,
      email: userDoc.email,
      photo: userDoc.photo,
    },
    company,
    progress,
  };

 // console.log('[LoginCheck] Sending response:', responsePayload);

  res.json(responsePayload);
}