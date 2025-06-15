// src\services\connectService.ts
import { AuthMethod, User, CompanyMember, Progress } from '@/models';
import {NotFoundError} from '@/errors/Errors';

interface SaveAuthMethodParams {
  userId: string;
  companyId?: string;
  type: string;
  accessToken: string;
  usedForLogin: boolean;
}

export async function saveAuthMethod(params: SaveAuthMethodParams) {
  const { userId, companyId, type, accessToken, usedForLogin } = params;

  const existing = await AuthMethod.findOne({ userId, type });

  if (existing) {
    existing.accessToken = accessToken;
    existing.usedForLogin = usedForLogin;
    await existing.save();
  } else {
    await AuthMethod.create({
      userId,
      companyId,
      type,
      accessToken,
      usedForLogin,
    });
  }
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
