// src\models\Company.ts
import { model, Schema } from 'mongoose';
import { ICompany } from '@/models/model-inter/inter';

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
