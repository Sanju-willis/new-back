// src\interfaces\models\IItems.ts
import { Types, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  type: 'product' | 'service';
  companyId: Types.ObjectId;
  description?: string;
  category?: string;
  features?: string[];
  mainBenefits?: string[];
  painPoints?: string[];
  useCases?: string[];
  pricePositioning?: string;
  targetAudience?: string[];
  topCompetitors?: string[];
  uniqueSellingPoints?: string[];
}