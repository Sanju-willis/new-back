// src\services\authService.ts
import User from '../models/User';
import {IUser } from '@/models/model-inter/BaseInter';
import AuthMethod from '../models/AuthMethod';
import { Profile } from 'passport-facebook';
import { dataLog } from '../utils/debuglog';
import CompanyMember from '../models/CompanyMember';
import Progress from '../models/Progress';
import { BadRequestError, NotFoundError } from '@/errors/Errors';


export async function handleFacebookLogin(  accessToken: string,  profile: Profile ): Promise<IUser> {
  const email = profile.emails?.[0]?.value;

  if (!email) throw new BadRequestError('Facebook profile does not have an email.');

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: profile.displayName,
      email,
      photo: profile.photos?.[0]?.value,
      provider: 'facebook',
      providerId: profile.id,
    });
    }
   // dataLog('✅ User Created:', user);

 const authMethod = await AuthMethod.findOneAndUpdate(
  { userId: user._id, type: 'facebook' },
  {
    userId: user._id,
    type: 'facebook',
    accessToken,
    
  },
  { upsert: true, new: true }
); 
 // dataLog('✅ Auth Method Updated:', authMethod);

  return user;
}


export async function getLoginResponse(userId: string) {
  const user = await User.findById(userId);

   if (!user) throw new NotFoundError('User not found');


  // ✅ FIXED: Use correct field name in CompanyMember lookup
  const member = await CompanyMember.findOne({ userId }).populate('companyId');

  if (!member || !member.companyId || typeof member.companyId === 'string') {
    return { user, company: null, progress: null };
  }

  const company = member.companyId;

  const progress = await Progress.findOne({ companyId: company._id });

  return {
    user,
    company,
    progress,
  };
}
