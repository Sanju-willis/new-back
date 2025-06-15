// src\services\signupService.ts
import {User, AuthMethod, CompanyMember, Progress }from '@/models';
import {IUser } from '@/models/model-inter/BaseInter';
import { Profile } from 'passport-facebook';
import { dataLog } from '../utils/debuglog';
import { BadRequestError, NotFoundError } from '@/errors/Errors';


export async function handleFacebookSignup(  accessToken: string,  profile: Profile ): Promise<IUser> {
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

export async function handleInstagramSignup(accessToken: string, profile: Profile) {
  const existingUser = await User.findOne({ email: profile.emails?.[0]?.value });

  if (!existingUser) {
    const newUser = await User.create({
      name: profile.displayName,
      email: profile.emails?.[0]?.value,
      photo: profile.photos?.[0]?.value,
    });

    await AuthMethod.create({
      userId: newUser._id,
      type: 'instagram',
      accessToken,
    });

    return newUser;
  }

  await AuthMethod.updateOne(
    { userId: existingUser._id, type: 'instagram' },
    { accessToken },
    { upsert: true }
  );

  return existingUser;
}


