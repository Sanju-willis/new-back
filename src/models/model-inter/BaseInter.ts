// src\models\model-inter\BaseInter.ts
// src\interfaces\models\IAuthMethod.ts
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  photo?: string;
  provider: string;
  providerId: string;
}
export interface IAuthMethod extends Document {
  userId: Types.ObjectId;
  type: string;
  accessToken: string;
  refreshToken: string;
}

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

export interface ICompanyMember extends Document {
    userId: Types.ObjectId;
    companyId: Types.ObjectId;
    role: string;
}

export interface IProgress extends Document {
  companyId: Types.ObjectId;
  stage: string;
  step: string;
}

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