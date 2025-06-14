// src\models\sync-models\insights-models\PageInsight.ts
import mongoose from 'mongoose';

const PageInsightSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'PageSync', required: true },
  name: { type: String, required: true }, // e.g., 'page_impressions'
  value: { type: mongoose.Schema.Types.Mixed, default: 0 }, // could be number or breakdown
  period: { type: String }, // e.g., 'day', 'lifetime'
  date: { type: Date, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true,
});

export const PageInsight = mongoose.model('PageInsight', PageInsightSchema);
