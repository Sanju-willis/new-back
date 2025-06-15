// src\services\loginService.ts
import { AuthMethod, User, CompanyMember, Progress } from '@/models';
import {NotFoundError} from '@/errors/Errors';

export async function handleFacebookLogin(userId: string) {
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