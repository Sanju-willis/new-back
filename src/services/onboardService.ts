// src\services\onboardService.ts
import Company, {ICompany} from '../models/Company';
import Progress, {IProgress} from '../models/Progress';
import CompanyMember from '../models/CompanyMember';
import Item from '../models/Items'; // 👈 Add this import


interface BasicCompanyInput {
  companyName: string;
  industry?: string;
  size?: string;
  type?: string;
  target_market: string;
  address?: string;
  website?: string;
  socialLinks?: string[];
  brandGuideUrl?: string;
  logoAssetsUrl?: string;
  pressKitUrl?: string;
  portfolioUrl?: string;
  contentLibraryUrl?: string;
  productPages?: string[];
  description: string;
  role?: string;
  items?: { name: string; type: 'product' | 'service' }[];
}

export const createBasicCompany = async (
  userId: string,
  data: BasicCompanyInput
): Promise<{ company: ICompany; progress: IProgress }> => {
  const existingMembership = await CompanyMember.findOne({ userId });
  if (existingMembership) throw new Error('CompanyExists');

  const company = await Company.create({
    name: data.companyName,
    industry: data.industry ?? '',
    size: data.size,
    type: data.type,
    targetMarket: data.target_market,
    address: data.address,
    website: data.website,
    socialLinks: data.socialLinks?.filter(Boolean),
    brandGuideUrl: data.brandGuideUrl,
    logoAssetsUrl: data.logoAssetsUrl,
    pressKitUrl: data.pressKitUrl,
    portfolioUrl: data.portfolioUrl,
    contentLibraryUrl: data.contentLibraryUrl,
    productPages: data.productPages?.filter(Boolean),
    description: data.description,
  });

  await CompanyMember.create({
    companyId: company._id,
    userId: userId,
    role: data.role ?? 'admin',
  });

  if (data.items?.length) {
    const itemsToInsert = data.items.map((item) => ({
      name: item.name,
      type: item.type,
      companyId: company._id,
    }));
    await Item.insertMany(itemsToInsert);
  }

  const progress = await Progress.create({
    companyId: company._id,
    stage: 'company_created',
    step: 'form_opened',
  });

  return { company, progress };
};
