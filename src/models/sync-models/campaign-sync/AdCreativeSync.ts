// src\models\sync-models\campaign-sync\AdCreativeSync.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface IAdCreative extends Document {
  adCreativeId: string;
  adId: Types.ObjectId;
  adAccountId: Types.ObjectId;
  name?: string;
  title?: string;
  body?: string;
  image_url?: string;
  object_story_spec?: any;
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
}

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
