// src\interfaces\models\IAuthMethod.ts
import { Document, Types } from 'mongoose';

export interface IAuthMethod extends Document {
  userId: Types.ObjectId;
  type: string;
  accessToken: string;
  refreshToken: string;
}
