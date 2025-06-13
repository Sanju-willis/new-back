// src\models\sync-models\campaign-sync\AdCreativeSync.ts
import { Schema, model } from 'mongoose';
import { IAdCreative } from '@/models/model-inter/CampaignInter';


const AdCreativeSchema = new Schema<IAdCreative>({
  adCreativeId: { type: String, required: true, unique: true },
  adId: { type: Schema.Types.ObjectId, ref: 'Ad', required: true },
  adAccountId: { type: Schema.Types.ObjectId, ref: 'AdAccount', required: true },
  name: String,
  title: String,
  body: String,
  image_url: String,
  object_story_spec: Schema.Types.Mixed,
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default model<IAdCreative>('AdCreative', AdCreativeSchema);
