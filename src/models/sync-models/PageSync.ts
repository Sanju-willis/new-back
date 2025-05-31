// src\models\sync-models\PageSync.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IPageSync extends Document {
  pageId: string;
  name: string;
  category?: string;
  accessToken: string;
  company: Types.ObjectId;
}

const PageSchema = new Schema<IPageSync>(
  {
    pageId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String },
    accessToken: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);

const PageModel = model<IPageSync>('Page', PageSchema);
export default PageModel;
