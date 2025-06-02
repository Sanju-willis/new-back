// src\models\Items.ts
import  { Schema, Document, model, Types } from 'mongoose';

export interface IItem extends Document {
  name: string;
  type: 'product' | 'service';
  companyId: Types.ObjectId;
}

const itemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['product', 'service'], required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);

export default model<IItem>('Item', itemSchema);
