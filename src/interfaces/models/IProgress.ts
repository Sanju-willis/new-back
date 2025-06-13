// src\interfaces\models\IProgress.ts
import { Document, Types } from 'mongoose';

export interface IProgress extends Document {
  companyId: Types.ObjectId;
  stage: string;
  step: string;
}