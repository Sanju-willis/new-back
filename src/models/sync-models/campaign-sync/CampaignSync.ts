// src\models\sync-models\campaign-sync\CampaignSync.ts
import { Schema, model } from 'mongoose';
import { ICampaign } from '@/models/model-inter/CampaignInter';

const CampaignSchema = new Schema<ICampaign>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessManagerId: { type: Schema.Types.ObjectId, ref: 'BusinessManager', required: true },
  adAccountId: { type: Schema.Types.ObjectId, ref: 'AdAccount', required: true },
  campaignId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  objective: { type: String, required: true },
  status: { type: String, required: true },
  startTime: { type: Date },
  stopTime: { type: Date },
    itemId: { type: Schema.Types.ObjectId, ref: 'Item' }, // ✅ NEW

}, { timestamps: true });

export default model<ICampaign>('Campaign', CampaignSchema);
