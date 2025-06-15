// src\services\connectService.ts
import { User, CompanyMember, Progress, Platforms } from '@/models';
import { NotFoundError } from '@/errors/Errors';
import { Profile } from 'passport-facebook';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { instagramSyncDispatcher } from '@/jobs/instagramSyncDispatcher';

// 🔁 Save Instagram connection to ConnectedPlatform + trigger sync
export async function handleInstagramConnect(
  accessToken: string,
  profile: Profile,
  req: AuthUserReq, // 👈 full Express request object with `user`
  refreshToken?: string,
  expiresAt?: Date
) {
  const { _id, companyId } = req.user;

  if (!_id || !companyId) {
    throw new NotFoundError('Missing user or company context');
  }

  await Platforms.findOneAndUpdate(
    { companyId, platform: 'instagram' },
    {
      companyId,
      platform: 'instagram',
      connectedBy: _id,
      connectedAt: new Date(),
      accessToken,
      refreshToken,
      expiresAt,
      platformUserId: profile.id,
      profile,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

await instagramSyncDispatcher(companyId, _id);

  return req.user;
}
