// src\models\AuthMethod.ts
import  { Schema, model, Document, Types} from 'mongoose';
import {IAuthMethod } from '@/models/model-inter/BaseInter';

const AuthMethodSchema = new Schema<IAuthMethod>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['facebook'], required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

const AuthMethod = model<IAuthMethod>('AuthMethod', AuthMethodSchema);
export default AuthMethod;
