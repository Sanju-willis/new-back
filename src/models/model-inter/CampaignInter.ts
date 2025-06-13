// src\models\model-inter\CampaignInter.ts
import { Document, Types } from 'mongoose';

export interface ICampaign extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessManagerId: Types.ObjectId;
  adAccountId: Types.ObjectId;
  campaignId: string;
  name: string;
  objective: string;
  status: string;
  startTime?: Date;
  stopTime?: Date;
  itemId?:Types.ObjectId;
}

export interface IAdSet extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessManagerId: Types.ObjectId;
  adAccountId: Types.ObjectId;
  campaignId: Types.ObjectId;
  adSetId: string;
  name: string;
  status: string;
  dailyBudget?: number;
}

export interface IAd extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessManagerId: Types.ObjectId;
  adAccountId: Types.ObjectId;
  adSetId: Types.ObjectId;
  adId: string;
  creativeId: string;
  name: string;
  status: string;
}

export interface IAdCreative extends Document {
  adCreativeId: string;
  adId: Types.ObjectId;
  adAccountId: Types.ObjectId;
  name?: string;
  title?: string;
  body?: string;
  image_url?: string;
  object_story_spec?: any;
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface IInsight extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessManagerId: Types.ObjectId;
  adAccountId: Types.ObjectId;
  adId: Types.ObjectId;
  adSetId?: Types.ObjectId | null;
  campaignId?: Types.ObjectId | null;
  impressions: number;
  clicks: number;
  spend: number;
  date: Date;
}