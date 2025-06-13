// src\interfaces\services\OnboardService.ts

export interface BasicCompanyInput {
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
