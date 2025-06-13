// src\models\sync-models\BmSync.ts
import { Schema, model } from 'mongoose';
import { IBusinessManager } from '@/models/model-inter/SyncInter';


const BusinessManagerSchema = new Schema<IBusinessManager>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: String, required: true },
  name: { type: String, required: true },
}, { timestamps: true });

export default model<IBusinessManager>('BusinessManager', BusinessManagerSchema);
