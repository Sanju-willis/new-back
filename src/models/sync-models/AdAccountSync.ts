// src\models\sync-models\AdAccountSync.ts
import { Schema, model } from 'mongoose';
import { IAdAccount } from '@/models/model-inter/SyncInter';

const AdAccountSchema = new Schema<IAdAccount>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessManagerId: { type: Schema.Types.ObjectId, ref: 'BusinessManager', required: true }, // ✅ Reference BM
  adAccountId: { type: String, required: true },
  name: { type: String, required: true },
  currency: { type: String, required: true },
}, { timestamps: true });

export default model<IAdAccount>('AdAccount', AdAccountSchema);
