// src\services\sync-services\instagramService.ts
import axios from 'axios';

interface InstagramSyncPayload {
  companyId: string;
  userId: string;
  accessToken: string;
  platformUserId: string;
}

// 📥 Sync Instagram profile data
export async function fetchInstagramProfile({
  accessToken,
  platformUserId,
}: InstagramSyncPayload) {
  const url = `https://graph.facebook.com/v18.0/${platformUserId}?fields=id,username,account_type,media_count,followers_count,follows_count&access_token=${accessToken}`;

  const { data } = await axios.get(url);
  console.log('📄 Fetched Instagram profile:', data);

  // TODO: Save data to DB (e.g., InstagramProfile model)
}

// 🖼️ Sync Instagram media data
export async function fetchInstagramMedia({
  accessToken,
  platformUserId,
}: InstagramSyncPayload) {
  const url = `https://graph.facebook.com/v18.0/${platformUserId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`;

  const { data } = await axios.get(url);
  console.log('🖼️ Fetched Instagram media:', data);

  // TODO: Save data to DB (e.g., InstagramMedia model)
}

// 📊 Sync Instagram insights data
export async function fetchInstagramInsights({
  accessToken,
  platformUserId,
}: InstagramSyncPayload) {
  const url = `https://graph.facebook.com/v18.0/${platformUserId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${accessToken}`;

  const { data } = await axios.get(url);
  console.log('📊 Fetched Instagram insights:', data);

  // TODO: Save data to DB (e.g., InstagramInsights model)
}
