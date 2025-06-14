// src\services\insight-service\syncPageInsights.ts
import { PageSync, PageInsight } from '@/models';
import { fetchPageInsights } from '@/utils/facebookApi';
import { BadRequestError } from '@/errors/Errors';

export async function syncPageInsights(companyId: string) {
  try {
    const pages = await PageSync.find({ companyId });

    if (!pages.length) {
      console.warn(`⚠️ No pages found for company ${companyId}`);
      return;
    }

    for (const page of pages) {
      try {
        const insights = await fetchPageInsights(page.pageId, page.accessToken);

        for (const metric of insights) {
          const doc = {
            pageId: page._id,
            name: metric.name,
            period: metric.period,
            value: Array.isArray(metric.values) && metric.values[0]?.value,
            date: new Date(metric.values[0]?.end_time || Date.now()),
            companyId,
          };

          await PageInsight.updateOne(
            { pageId: page._id, name: metric.name, date: doc.date },
            doc,
            { upsert: true }
          );
        }
      } catch (err: any) {
        console.error(`❌ Failed to sync insights for page ${page.pageId}`, err.message);
        // Optional: continue instead of breaking the whole loop
        continue;
      }
    }

    return { pagesProcessed: pages.length };
  } catch (err) {
    console.error(`❌ Failed to sync page insights for company ${companyId}`, err);
    throw new BadRequestError('Failed to sync page insights');
  }
}
