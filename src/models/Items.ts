// src\models\Items.ts
import { Schema, Document, model, Types } from 'mongoose';
import { IItem } from '@/models/model-inter/BaseInter';


const itemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['product', 'service'], required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },

    // New optional fields
    description: { type: String },
    category: { type: String },
    features: [{ type: String }],
    mainBenefits: [{ type: String }],
    painPoints: [{ type: String }],
    useCases: [{ type: String }],
    pricePositioning: { type: String },
    targetAudience: [{ type: String }],
    topCompetitors: [{ type: String }],
    uniqueSellingPoints: [{ type: String }],
  },
  { timestamps: true }
);

export default model<IItem>('Item', itemSchema);
