// src\services\sync-services\BmService.ts
import axios from 'axios';
import AuthMethod from '../../models/AuthMethod';
import BusinessManager from '../../models/sync-models/BmSync';

export async function syncBusinessManager(companyId: string, userId: string) {
  try {
    const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
    if (!auth?.accessToken) {
      throw new Error('Facebook access token not found for user');
    }

    const accessToken = auth.accessToken;

    const fbRes = await axios.get(
      `https://graph.facebook.com/v18.0/me/businesses?access_token=${accessToken}`
    );

    const businesses = fbRes.data?.data || [];

    for (const biz of businesses) {
      const bizData = {
        businessId: biz.id,
        name: biz.name,
        companyId,
        userId,
      };

      const result = await BusinessManager.updateOne(
        { businessId: biz.id },
        bizData,
        { upsert: true }
      );

      console.log(`🏢 Synced Business Manager: ${biz.name} (${biz.id})`);
      console.log('📋 MongoDB write result:', result);
    }

    console.log(`✅ Total ${businesses.length} Business Managers synced for company ${companyId}`);

    return { businessManagersSynced: businesses.length };
  } catch (err) {
    console.error(`❌ Failed to sync Business Managers for company ${companyId}`, err);
    throw err;
  }
}
