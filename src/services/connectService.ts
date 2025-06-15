// src\services\connectService.ts
import { User, CompanyMember, Progress, Platforms } from '@/models';
import { NotFoundError } from '@/errors/Errors';
import { Profile } from 'passport-facebook';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { instagramSyncDispatcher } from '@/jobs/instagramSyncDispatcher';
import axios from 'axios';


// ⬇️ helper to fetch IG Business Account ID
async function getInstagramBusinessId(accessToken: string): Promise<string | null> {
  const url = `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`;
  const { data } = await axios.get(url);

  const pages = data.data || [];
  for (const page of pages) {
    if (page.instagram_business_account?.id) {
      return page.instagram_business_account.id;
    }
  }
  return null;
}

export async function handleInstagramConnect(
  accessToken: string,
  profile: Profile,
  req: AuthUserReq,
  refreshToken?: string,
  expiresAt?: Date
) {
  const { _id, companyId } = req.user;
  if (!_id || !companyId) throw new NotFoundError('Missing user or company context');

  // ⬇️ Fetch correct Instagram Business ID
  const instagramBusinessId = await getInstagramBusinessId(accessToken);
  if (!instagramBusinessId) throw new Error('No Instagram Business Account connected');

  // ⬇️ Save with correct IG ID
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
      platformUserId: instagramBusinessId,
      profile, // optional: still keep Facebook profile info
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // ✅ Now trigger sync with correct IG ID
  await instagramSyncDispatcher({
    companyId,
    userId: _id,
    accessToken,
    platformUserId: instagramBusinessId,
  });

  return req.user;
}
