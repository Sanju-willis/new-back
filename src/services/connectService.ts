// src\services\connectService.ts
import { AuthMethod, User, CompanyMember, Progress } from '@/models';
import { NotFoundError } from '@/errors/Errors';

interface SaveAuthMethodParams {
  userId: string;
  companyId?: string;
  type: string; // 'facebook' | 'instagram' | 'linkedin' | etc.
  accessToken: string;
  usedForLogin: boolean;
}

// 🔐 Create or update the user's auth method
export async function saveAuthMethod({
  userId,
  companyId,
  type,
  accessToken,
  usedForLogin
}: SaveAuthMethodParams) {
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

// 📦 Get response after social connection (connect callback)
export async function getConnectResponse(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');

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
