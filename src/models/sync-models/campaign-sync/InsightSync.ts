// src\models\sync-models\campaign-sync\InsightSync.ts
import { Schema, model } from 'mongoose';
import { IInsight } from '@/models/model-inter/CampaignInter';

const InsightSchema = new Schema<IInsight>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessManagerId: { type: Schema.Types.ObjectId, ref: 'BusinessManager', required: true },
  adAccountId: { type: Schema.Types.ObjectId, ref: 'AdAccount', required: true },
  adId: { type: Schema.Types.ObjectId, ref: 'Ad', required: true },
  adSetId: { type: Schema.Types.ObjectId, ref: 'AdSet', default: null },
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', default: null },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  spend: { type: Number, default: 0 },
  date: { type: Date, required: true },
}, { timestamps: true });

export default model<IInsight>('Insight', InsightSchema);
