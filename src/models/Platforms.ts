// src\models\Platforms.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface IPlatforms extends Document {
  companyId: Types.ObjectId;
  platform: 'facebook' | 'instagram' | 'google' | 'linkedin' | 'tiktok' | 'youtube';
  connectedBy: Types.ObjectId;
  connectedAt: Date;

  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;

  platformUserId?: string;     // external user ID from the platform
  profile?: Record<string, any>; // raw platform profile data
}

const ConnectedPlatformSchema = new Schema<IPlatforms>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    platform: {
      type: String,
      enum: ['facebook', 'instagram', 'google', 'linkedin', 'tiktok', 'youtube'],
      required: true
    },
    connectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    connectedAt: { type: Date, default: Date.now },

    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiresAt: { type: Date },

    platformUserId: { type: String },
    profile: { type: Schema.Types.Mixed }, // can hold anything
  },
  { timestamps: true }
);

const Platforms = model<IPlatforms>('ConnectedPlatform', ConnectedPlatformSchema);
export default Platforms;
