// src\models\sync-models\AdAccountSync.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface IAdAccount extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessManagerId: Types.ObjectId; // 🔗 Reference to BusinessManager model
  adAccountId: string;
  name: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdAccountSchema = new Schema<IAdAccount>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessManagerId: { type: Schema.Types.ObjectId, ref: 'BusinessManager', required: true }, // ✅ Reference BM
  adAccountId: { type: String, required: true },
  name: { type: String, required: true },
  currency: { type: String, required: true },
}, { timestamps: true });

export default model<IAdAccount>('AdAccount', AdAccountSchema);
