// src\models\Progress.ts
import  { Schema, model } from 'mongoose';
import {IProgress} from '@/interfaces/models/IProgress';

const ProgressSchema = new Schema<IProgress>(
  {
    companyId: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
    stage: {
      type: String,
      enum: ['signed_up', 'company_created', 'items_added'],
      required: true
    },
    step: String,
  },
  { timestamps: true }
);

const Progress = model<IProgress>('Progress', ProgressSchema);
export default Progress;
