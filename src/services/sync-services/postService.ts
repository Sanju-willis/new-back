// src\services\sync-services\postService.ts
import axios from 'axios';
import AuthMethod from '../../models/AuthMethod';
import PageSync from '../../models/sync-models/PageSync';
import PostSync from '../../models/sync-models/PostSync';

export async function syncUserPosts(companyId: string, userId: string) {
  try {
    const auth = await AuthMethod.findOne({ userId, type: 'facebook' });
    if (!auth?.accessToken) {
      throw new Error('Facebook access token not found');
    }

    const pages = await PageSync.find({ company: companyId });

    for (const page of pages) {
      const res = await axios.get(
        `https://graph.facebook.com/v18.0/${page.pageId}/posts?access_token=${page.accessToken}`
      );

      const posts = res.data?.data || [];

      for (const post of posts) {
        const postData = {
          postId: post.id,
          message: post.message,
          createdTime: new Date(post.created_time),
          permalinkUrl: post.permalink_url,
          pageId: page.pageId,
          company: companyId,
        };

        const result = await PostSync.updateOne(
          { postId: post.id },
          postData,
          { upsert: true }
        );

        console.log(`📝 Synced post: ${post.id} from page ${page.pageId}`);
        console.log('📋 MongoDB write result:', result);
      }
    }

    console.log(`✅ Facebook posts synced for company ${companyId}`);
    return { pagesChecked: pages.length };
  } catch (err) {
    console.error(`❌ Failed to sync posts for company ${companyId}`, err);
    throw err;
  }
}
