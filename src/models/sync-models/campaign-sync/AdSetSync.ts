// src\models\sync-models\campaign-sync\AdSetSync.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface IAdSet extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessManagerId: Types.ObjectId;
  adAccountId: Types.ObjectId;
  campaignId: Types.ObjectId;
  adSetId: string;
  name: string;
  status: string;
  dailyBudget?: number;
}

const AdSetSchema = new Schema<IAdSet>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessManagerId: { type: Schema.Types.ObjectId, ref: 'BusinessManager', required: true },
  adAccountId: { type: Schema.Types.ObjectId, ref: 'AdAccount', required: true },
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
  adSetId: { type: String, required: true, unique: true }, // FB ID
  name: { type: String, required: true },
  status: { type: String, required: true },
  dailyBudget: { type: Number },
}, { timestamps: true });

export default model<IAdSet>('AdSet', AdSetSchema);
