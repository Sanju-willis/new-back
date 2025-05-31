// src\services\authService.ts
import User,{IUser} from '../models/User';
import AuthMethod from '../models/AuthMethod';
import { Profile } from 'passport-facebook';
import { dataLog } from '../utils/debuglog';
import CompanyMember from '../models/CompanyMember';
import Progress from '../models/Progress';

export async function handleFacebookLogin(  accessToken: string,  profile: Profile ): Promise<IUser> {
  const email = profile.emails?.[0]?.value;

  if (!email) throw new Error('Facebook profile does not have an email.');

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
 // dataLog('[getLoginResponse] Fetching user:', userId);
  const user = await User.findById(userId);

  if (!user) {
   //dataLog('[getLoginResponse] User not found:', userId);
    throw new Error('User not found');
  }

 // dataLog('[getLoginResponse] User found:', user._id);

  const member = await CompanyMember.findOne({ user: userId }).populate('companyId');

  if (!member) {
    //dataLog('[getLoginResponse] User is not a member of any company');
    return { user, company: null, progress: null };
  }

  if (!member.companyId || typeof member.companyId === 'string') {
  //  dataLog('[getLoginResponse] Member has no valid companyId or companyId is string:', member.companyId);
    return { user, company: null, progress: null };
  }

  const company = member.companyId;
 // dataLog('[getLoginResponse] User is member of company:', company._id);

  const progress = await Progress.findOne({ companyId: company._id });
  //dataLog('[getLoginResponse] Progress:', progress);

  return {
    user,
    company,
    progress,
  };
}
