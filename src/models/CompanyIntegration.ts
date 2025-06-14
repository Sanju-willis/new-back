// src\models\CompanyIntegration.ts
import { Schema, model, Types } from 'mongoose';

const CompanyIntegrationSchema = new Schema(
  {
    companyId: { type: Types.ObjectId, ref: 'Company', required: true },
    userId: { type: Types.ObjectId, ref: 'User' }, // who connected it
    type: {
      type: String,
      enum: ['facebook', 'instagram', 'google', 'linkedin', 'tiktok'],
      required: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiresAt: { type: Date },
    providerId: { type: String }, // e.g. pageId, channelId, accountId
    scope: [String],
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const CompanyIntegration = model('CompanyIntegration', CompanyIntegrationSchema);
