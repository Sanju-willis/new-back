// src\services\sync-services\pageService.ts
import axios from 'axios';
import PageSync from '../../models/sync-models/PageSync';
import AuthMethod from '../../models/AuthMethod';

export async function syncFacebookPages(companyId: string, userId: string) {
  try {
    const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
    if (!auth?.accessToken) {
      throw new Error('Facebook access token not found for user');
    }

    const accessToken = auth.accessToken;

    const fbRes = await axios.get(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );

    const pages = fbRes.data?.data || [];

    for (const page of pages) {
      const pageData = {
        pageId: page.id,
        name: page.name,
        accessToken: page.access_token,
        category: page.category,
        companyId: companyId,
      };

      const result = await PageSync.updateOne(
        { pageId: page.id },
        pageData,
        { upsert: true }
      );

      //console.log(`📄 Synced page: ${page.name} (${page.id})`);
     // console.log('📋 MongoDB write result:', result);
    }

   // console.log(`✅ Total ${pages.length} Facebook pages synced for company ${companyId}`);

    return { pagesSynced: pages.length }; // ✅ cleaner return value
  } catch (err) {
    console.error(`❌ Failed to sync Facebook pages for company ${companyId}`, err);
    throw err;
  }
}
