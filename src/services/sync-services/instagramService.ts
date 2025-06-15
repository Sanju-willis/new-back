// src\services\sync-services\instagramService.ts
import axios from 'axios';
import { InstagramProfile } from '@/models/sync-models/InstagramProfile';
import { InstagramMedia } from '@/models/sync-models/InstagramMedia';
import { InstagramInsights } from '@/models/sync-models/InstagramInsights';

interface InstagramSyncPayload {
  companyId: string;
  userId: string;
  accessToken: string;
  platformUserId: string;
}

// 🔁 Get Instagram Business ID via /me/accounts
async function getInstagramBusinessId(accessToken: string): Promise<string | null> {
  console.log('🔍 Fetching Instagram Business ID from /me/accounts...');
  try {
    const url = `https://graph.facebook.com/v22.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`;
    const { data } = await axios.get(url);

    const pages = data.data || [];
    for (const page of pages) {
      if (page.instagram_business_account?.id) {
        console.log('✅ Found Instagram Business ID:', page.instagram_business_account.id);
        return page.instagram_business_account.id;
      }
    }
    console.warn('⚠️ No linked Instagram Business Account found');
    return null;
  } catch (err: any) {
    console.error('❌ Failed to fetch Instagram Business ID:', err.response?.data || err.message);
    return null;
  }
}

// 📅 Sync Instagram profile data
export async function fetchInstagramProfile({
  companyId,
  userId,
  accessToken,
  platformUserId,
}: InstagramSyncPayload) {
  console.log('📡 Fetching Instagram profile...');
  const resolvedUserId = platformUserId || (await getInstagramBusinessId(accessToken));
  if (!resolvedUserId) return;

  try {
    const url = `https://graph.facebook.com/v22.0/${resolvedUserId}?fields=id,username,media_count,followers_count&access_token=${accessToken}`;
    const { data } = await axios.get(url);
    console.log('✅ Fetched profile:', data);

    const result = await InstagramProfile.findOneAndUpdate(
      { companyId, userId },
      {
        ...data,
        companyId,
        userId,
        platformUserId: data.id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('💾 Saved Instagram profile to DB:', result._id.toString());
  } catch (err: any) {
    console.error('❌ Failed to sync Instagram profile:', err.response?.data || err.message);
  }
}

// 🖼️ Sync Instagram media
export async function fetchInstagramMedia({
  companyId,
  userId,
  accessToken,
  platformUserId,
}: InstagramSyncPayload) {
  console.log('📡 Fetching Instagram media...');
  const resolvedUserId = platformUserId || (await getInstagramBusinessId(accessToken));
  if (!resolvedUserId) return;

  try {
    const url = `https://graph.facebook.com/v22.0/${resolvedUserId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`;
    const { data } = await axios.get(url);
    const mediaItems = data.data || [];
    console.log(`✅ Fetched ${mediaItems.length} media items`);

    for (const item of mediaItems) {
      const result = await InstagramMedia.findOneAndUpdate(
        { companyId, userId, platformMediaId: item.id },
        {
          ...item,
          companyId,
          userId,
          platformMediaId: item.id,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log('💾 Saved media item to DB:', result._id.toString());
    }
  } catch (err: any) {
    console.error('❌ Failed to sync Instagram media:', err.response?.data || err.message);
  }
}

// 📊 Sync Instagram insights
// 📊 Sync Instagram insights
export async function fetchInstagramInsights({
  companyId,
  userId,
  accessToken,
  platformUserId,
}: InstagramSyncPayload) {
  console.log('📡 Fetching Instagram insights...');
  const resolvedUserId = platformUserId || (await getInstagramBusinessId(accessToken));
  if (!resolvedUserId) return;

  try {
    const metrics = [
      'profile_views',
      'website_clicks',
      'accounts_engaged',
      'total_interactions',
    ];
    const query = `?metric=${metrics.join(',')}&period=day&metric_type=total_value&access_token=${accessToken}`;
    const url = `https://graph.facebook.com/v22.0/${resolvedUserId}/insights${query}`;
    const { data } = await axios.get(url);
    const insights = data.data || [];
    console.log(`✅ Fetched ${insights.length} insight metrics`);

    for (const insight of insights) {
      const result = await InstagramInsights.findOneAndUpdate(
        {
          companyId,
          userId,
          name: insight.name,
          period: insight.period,
          end_time: insight.values?.[0]?.end_time,
        },
        {
          ...insight,
          companyId,
          userId,
          platformUserId: resolvedUserId,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`💾 Saved insight "${insight.name}" to DB:`, result._id.toString());
    }
  } catch (err: any) {
    console.error('❌ Failed to sync Instagram insights:', err.response?.data || err.message);
  }
}
