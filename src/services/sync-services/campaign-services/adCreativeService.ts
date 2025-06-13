// src\services\sync-services\campaign-services\adCreativeService.ts
import axios from 'axios';
import AuthMethod from '@/models/AuthMethod';
import AdCreative from '@/models/sync-models/campaign-sync/AdCreativeSync';
import Ad from '@/models/sync-models/campaign-sync/AdSync';

export async function syncAdCreatives(companyId: string, userId: string) {
  const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
  if (!auth?.accessToken) throw new Error('Missing Facebook access token');
  const accessToken = auth.accessToken;

  const ads = await Ad.find({ companyId, userId });
  if (!ads.length) return console.warn('⚠️ No Ads found');

  for (const ad of ads) {
    try {
      const creativeId = ad.creativeId || ad.adId; // fallback
      const url = `https://graph.facebook.com/v18.0/${creativeId}`;
      const { data } = await axios.get(url, {
        params: {
          access_token: accessToken,
          fields: 'name,title,body,image_url,object_story_spec',
        },
      });

      const doc = {
        adCreativeId: creativeId,
        adId: ad._id,
        adAccountId: ad.adAccountId,
        name: data.name,
        title: data.title,
        body: data.body,
        image_url: data.image_url,
        object_story_spec: data.object_story_spec,
        companyId,
        userId,
      };

      await AdCreative.updateOne({ adCreativeId: creativeId }, doc, { upsert: true });
     // console.log(`🎨 Synced Ad Creative: ${creativeId}`);
    } catch (err: any) {
      console.error(`❌ Failed to sync Ad Creative for Ad ${ad.adId}`, err?.response?.data || err.message);
    }
  }
}
