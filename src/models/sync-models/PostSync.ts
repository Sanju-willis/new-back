// src\models\sync-models\PostSync.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IPostSync extends Document {
  postId: string;
  message?: string;
  createdTime: Date;
  permalinkUrl?: string;
  pageId: string;
  company: Types.ObjectId;
}

const PostSchema = new Schema<IPostSync>(
  {
    postId: { type: String, required: true, unique: true },
    message: { type: String },
    createdTime: { type: Date, required: true },
    permalinkUrl: { type: String },
    pageId: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);

const PostModel = model<IPostSync>('Post', PostSchema, 'posts');
export default PostModel;
