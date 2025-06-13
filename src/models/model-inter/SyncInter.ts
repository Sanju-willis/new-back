// src\models\model-inter\SyncInter.ts
import { Document, Types } from 'mongoose';

export interface IBusinessManager extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdAccount extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  businessManagerId: Types.ObjectId; // 🔗 Reference to BusinessManager model
  adAccountId: string;
  name: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPageSync extends Document {
  businessManagerId: Types.ObjectId;
  pageId: string;
  name: string;
  category?: string;
  accessToken: string;
  companyId: Types.ObjectId;
}
export interface IPostSync extends Document {
    companyId: Types.ObjectId;
  pageId: Types.ObjectId;
  postId: string;
  message?: string;
  createdTime: Date;
  permalinkUrl?: string;
}