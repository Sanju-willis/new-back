// src\services\onboardService.ts
import Company, {ICompany} from '../models/Company';
import Progress, {IProgress} from '../models/Progress';
import CompanyMember from '../models/CompanyMember';
import Item from '../models/Items'; // 👈 Add this import


interface BasicCompanyInput {
  companyName: string;
  industry?: string;
  target_market: string;
  description: string;
  role?: string;
    items?: { name: string; type: 'product' | 'service' }[];

}

export const createBasicCompany = async ( userId: string, data: BasicCompanyInput): Promise<{ company: ICompany; progress: IProgress }> => {

  const existingMembership = await CompanyMember.findOne({ userId });
  if (existingMembership) throw new Error('CompanyExists');

  const company = await Company.create({
    name: data.companyName,
    industry: data.industry ?? '',
    targetMarket: data.target_market,
    description: data.description,
  });

  await CompanyMember.create({
    companyId: company._id, // ✅ use correct field name
    userId: userId,
    role: data.role ?? 'admin', // ✅ use dynamic role or fallback
  });
 if (data.items && data.items.length > 0) {
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
