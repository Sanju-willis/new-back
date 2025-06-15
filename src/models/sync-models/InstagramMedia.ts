// src\models\sync-models\InstagramMedia.ts
import mongoose from 'mongoose';

const InstagramMediaSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platformUserId: { type: String, required: true },
  mediaId: { type: String, required: true, unique: true },
  caption: String,
  media_type: String,
  media_url: String,
  permalink: String,
  timestamp: Date,
  like_count: Number,
  comments_count: Number,
}, { timestamps: true });

export const InstagramMedia = mongoose.model('InstagramMedia', InstagramMediaSchema);
