// src\models\sync-models\BmSync.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface IBusinessManager extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessManagerSchema = new Schema<IBusinessManager>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: String, required: true },
  name: { type: String, required: true },
}, { timestamps: true });

export default model<IBusinessManager>('BusinessManager', BusinessManagerSchema);
