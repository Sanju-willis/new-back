// src\models\sync-models\InstagramProfile.ts
import mongoose from 'mongoose';

const InstagramProfileSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platformUserId: { type: String, required: true },
  username: String,
  account_type: String,
  media_count: Number,
  followers_count: Number,
  follows_count: Number,
}, { timestamps: true });

export const InstagramProfile = mongoose.model('InstagramProfile', InstagramProfileSchema);
