// src\services\loginService.ts
import { AuthMethod, User, CompanyMember, Progress, Platforms  } from '@/models';
import {NotFoundError} from '@/errors/Errors';

export async function handleFacebookLogin(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');

  const member = await CompanyMember.findOne({ userId }).populate('companyId');
  if (!member || !member.companyId || typeof member.companyId === 'string') {
    return { user, company: null, progress: null, platforms: [] };
  }

  const company = member.companyId;
  const progress = await Progress.findOne({ companyId: company._id });
  const platforms = await Platforms.find({ companyId: company._id });

  return { user, company, progress, platforms };
}

export async function handleInstagramLogin(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');

  const member = await CompanyMember.findOne({ userId }).populate('companyId');
  if (!member || !member.companyId || typeof member.companyId === 'string') {
    return { user, company: null, progress: null };
  }

  const company = member.companyId;
  const progress = await Progress.findOne({ companyId: company._id });

  return { user, company, progress };
}