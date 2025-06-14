// src\models\sync-models\campaign-sync\AdSync.ts
import { Schema, model } from 'mongoose';
import { IAd } from '@/models/model-inter/CampaignInter';

const AdSchema = new Schema<IAd>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessManagerId: { type: Schema.Types.ObjectId, ref: 'BusinessManager', required: true },
  adAccountId: { type: Schema.Types.ObjectId, ref: 'AdAccount', required: true },
  adSetId: { type: Schema.Types.ObjectId, ref: 'AdSet', required: true },
  adId: { type: String, required: true, unique: true },
  creativeId: { type: String, required: true }, // ✅ New field
  name: { type: String, required: true },
  status: { type: String, required: true },
}, { timestamps: true });

export default model<IAd>('Ad', AdSchema);
