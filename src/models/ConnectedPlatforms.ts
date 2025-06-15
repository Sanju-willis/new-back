// src\models\ConnectedPlatforms.ts
// src/models/ConnectedPlatform.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface IConnectedPlatform extends Document {
  companyId: Types.ObjectId;
  platform: 'facebook' | 'instagram' | 'google' | 'linkedin' | 'tiktok' | 'youtube';
  connectedBy: Types.ObjectId; // userId
  connectedAt: Date;
}

const ConnectedPlatformSchema = new Schema<IConnectedPlatform>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    platform: {
      type: String,
      enum: ['facebook', 'instagram', 'google', 'linkedin', 'tiktok', 'youtube'],
      required: true
    },
    connectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    connectedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const ConnectedPlatform = model<IConnectedPlatform>('ConnectedPlatform', ConnectedPlatformSchema);
export default ConnectedPlatform;
