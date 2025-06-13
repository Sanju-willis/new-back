// src\controllers\authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { flowLog, dataLog } from '../utils/debuglog';
import { getLoginResponse } from '../services/authService';
import { AuthUserReq } from '../interfaces/AuthUser';
import { UnauthorizedError } from '@/errors/Errors';

export const handleFacebookCallback = async (req: Request, res: Response) => {
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



export async function handleLoginCheck(req: Request, res: Response): Promise<void> {
  const { user } = req as AuthUserReq;

   if (!user) throw new UnauthorizedError();


  const { company, progress, user: userDoc } = await getLoginResponse(user._id);

 //flowLog('🔄1 Auth Cookie  data:', company) ;

  
   // ✅ Re-sign JWT with companyId if available
  if (company?._id) {
    const newToken = jwt.sign(
      {
        id: user._id,
        companyId: company._id.toString(),
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('companyId', company._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  const responsePayload = {
    user: {
      name: userDoc.name,
      email: userDoc.email,
      photo: userDoc.photo,
    },
    company,
    progress,
  };

  res.json(responsePayload);
}
