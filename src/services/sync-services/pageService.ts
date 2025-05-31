// src\services\sync-services\pageService.ts
import axios from 'axios';
import PageSync from '../../models/sync-models/PageSync';
import AuthMethod from '../../models/AuthMethod';

export async function syncFacebookPages(companyId: string, userId: string) {
  try {
    // 🔐 Get the Facebook access token for the user
    const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
    if (!auth || !auth.accessToken) {
      throw new Error('Facebook access token not found for user');
    }

    const accessToken = auth.accessToken;

    // 📡 Call Facebook Graph API to get pages
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
        company: companyId,
        userId: userId,
      };

      // 💾 Upsert into PageSync collection
      await PageSync.updateOne(
        { pageId: page.id, company: companyId },
        pageData,
        { upsert: true }
      );

      console.log(`📄 Synced page: ${page.name} (${page.id})`);
    }

    console.log(`✅ Total ${pages.length} Facebook pages synced for company ${companyId}`);
  } catch (err) {
    console.error(`❌ Failed to sync Facebook pages for company ${companyId}`, err);
    throw err;
  }
}
