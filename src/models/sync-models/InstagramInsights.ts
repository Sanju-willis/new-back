// src/models/sync-models/InstagramInsights.ts
import mongoose from 'mongoose';

const InstagramInsightsSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platformUserId: { type: String, required: true },

  name: { type: String, required: true },
  period: { type: String, required: true },
  title: String,
  description: String,

  total_value: {
    value: Number,
  },

  end_time: Date, // required for deduplication and analysis
}, {
  timestamps: true,
  strict: true,
});

export const InstagramInsights = mongoose.model('InstagramInsights', InstagramInsightsSchema);
