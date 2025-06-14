// src\controllers\loginController.ts
// src\controllers\authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getLoginResponse } from '../services/authService';
import { AuthUserReq } from '../interfaces/AuthUser';
import { UnauthorizedError } from '@/errors/Errors';

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