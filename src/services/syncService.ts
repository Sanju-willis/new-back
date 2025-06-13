// src\services\syncService.ts
import Company from '../models/Company';
import Item from '../models/Items';

// Company Services
export const findCompanyById = async (companyId: string) => {
  return await Company.findById(companyId);
};

export const updateCompanyById = async (companyId: string, data: Partial<any>) => {
  return await Company.findByIdAndUpdate(
    companyId,
    {
      ...data,
      socialLinks: data.socialLinks?.filter(Boolean),
      productPages: data.productPages?.filter(Boolean),
    },
    { new: true }
  );
};

// Item Services
export const getCompanyItems = async (companyId: string) => {
  return await Item.find({ companyId }).sort({ createdAt: -1 });
};

export const updateItemById = async (companyId: string, itemId: string, data: Partial<any>) => {
  return await Item.findOneAndUpdate(
    { _id: itemId, companyId },
    data,
    { new: true }
  );
};
