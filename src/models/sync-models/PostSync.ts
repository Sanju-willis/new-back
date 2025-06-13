// src\models\sync-models\PostSync.ts

import { Schema, model } from 'mongoose';
import { IPostSync } from '@/models/model-inter/SyncInter';

const PostSchema = new Schema<IPostSync>(
  {
    postId: { type: String, required: true, unique: true },
    message: { type: String },
    createdTime: { type: Date, required: true },
    permalinkUrl: { type: String },
    pageId: { type: Schema.Types.ObjectId, ref: 'Page', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);

const PostModel = model<IPostSync>('Post', PostSchema, 'posts');
export default PostModel;
