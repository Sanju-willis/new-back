// src\models\sync-models\InstagramInsights.ts
import mongoose from 'mongoose';

const InstagramInsightsSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platformUserId: { type: String, required: true },
  metric: String,
  value: Number,
  date: Date,
}, { timestamps: true });

export const InstagramInsights = mongoose.model('InstagramInsights', InstagramInsightsSchema);
