// src\models\Company.ts
import { Document, model, Schema, Types} from 'mongoose';

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

const CompanySchema = new Schema<ICompany>(
  {
    name: String,
    industry: String,
    size: String,
    type: String,
    targetMarket: String,
    address: String,
    website: String,
    socialLinks: [String],
    brandGuideUrl: String,
    logoAssetsUrl: String,
    pressKitUrl: String,
    portfolioUrl: String,
    contentLibraryUrl: String,
    productPages: [String],
    description: String,
  },
  { timestamps: true }
);

const Company = model<ICompany>('Company', CompanySchema);
export default Company;