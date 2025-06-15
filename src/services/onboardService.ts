// src\services\onboardService.ts
import  {ICompany, IProgress} from '@/models/model-inter/BaseInter';
import { Progress, Company, Item, CompanyMember, AuthMethod, Platforms } from '@/models';
import { IPlatforms } from '@/models/Platforms';
import { CompanyInput } from '@/interfaces/services/OnboardService';
import { ConflictError } from '@/errors/Errors';


export const createBasicCompany = async ( userId: string, data: CompanyInput)
: Promise<{ company: ICompany; progress: IProgress; platforms: IPlatforms[] }> => 
 {
  const existingMembership = await CompanyMember.findOne({ userId });
  if (existingMembership) throw new ConflictError('User is already part of a company.');

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
const createdPlatforms: IPlatforms[] = [];

const authMethods = await AuthMethod.find({ userId });
for (const auth of authMethods) {
  console.log('➡️ Found auth method:', auth.type, auth.accessToken ? '✅' : '❌ no token');

const exists = await Platforms.findOne({
  companyId: company._id,
  platform: auth.type,
});
console.log('🔍 Existing platform:', !!exists);

if (!exists && auth.accessToken) {
  const platform = await Platforms.create({
    companyId: company._id,
    platform: auth.type,
    connectedBy: userId,
    connectedAt: new Date(),
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  });
  console.log('✅ Created platform:', platform.platform);
  createdPlatforms.push(platform);
}}
return { company, progress, platforms: createdPlatforms };
};
