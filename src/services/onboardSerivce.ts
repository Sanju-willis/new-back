// src\services\onboardSerivce.ts
import Company, {ICompany} from '../models/Company';
import User from '../models/User';
import Progress, {IProgress} from '../models/Progress';
import CompanyMember from '../models/CompanyMember';

interface BasicCompanyInput {
  companyName: string;
  industry?: string;
  target_market: string;
  description: string;
  role?: string;
}

export const createBasicCompany = async (
  userId: string,
  data: BasicCompanyInput
): Promise<{ company: ICompany; progress: IProgress }> => {
  const existing = await Company.findOne({ appUserId: userId });
  if (existing) throw new Error('CompanyExists');

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

  const progress = await Progress.create({
    companyId: company._id,
    stage: 'company_created',
    step: 'form_opened',
  });

  return { company, progress };
};
