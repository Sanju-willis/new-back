// src\models\sync-models\campaign-sync\CampaignSync.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface ICampaign extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessManagerId: Types.ObjectId;
  adAccountId: Types.ObjectId;
  campaignId: string;
  name: string;
  objective: string;
  status: string;
  startTime?: Date;
  stopTime?: Date;
}

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
}, { timestamps: true });

export default model<ICampaign>('Campaign', CampaignSchema);
