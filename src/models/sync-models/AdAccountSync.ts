// src\models\sync-models\AdAccountSync.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface IAdAccount extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  adAccountId: string;
  name: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdAccountSchema = new Schema<IAdAccount>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adAccountId: { type: String, required: true },
  name: { type: String, required: true },
  currency: { type: String, required: true },
}, { timestamps: true });

export default model<IAdAccount>('AdAccount', AdAccountSchema);
