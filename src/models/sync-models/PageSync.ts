// src\models\sync-models\PageSync.ts

import { Schema, model } from 'mongoose';
import { IPageSync } from '@/models/model-inter/SyncInter';

const PageSchema = new Schema<IPageSync>(
  {
    businessManagerId: { type: Schema.Types.ObjectId, ref: 'BusinessManager', required: true },
    pageId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String },
    accessToken: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);

// 👇 Optional: force collection name to 'pages' to avoid mismatch
const PageModel = model<IPageSync>('Page', PageSchema, 'pages');

export default PageModel;
