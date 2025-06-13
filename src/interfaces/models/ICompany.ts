// src\interfaces\models\ICompany.ts
import { Document, Types } from 'mongoose';

export interface ICompany extends Document {
  _id: Types.ObjectId;
  name: string;
  industry: string;
  size?: string;
  type?: string;
  targetMarket: string;
  description: string;
  address?: string;
  website?: string;
  socialLinks?: string[];
  brandGuideUrl?: string;
  logoAssetsUrl?: string;
  pressKitUrl?: string;
  portfolioUrl?: string;
  contentLibraryUrl?: string;
  productPages?: string[];
}
