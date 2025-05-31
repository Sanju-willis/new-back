// src\models\Progress.ts
import mongoose, { Schema, Types, Document, model } from 'mongoose';

export interface IProgress extends Document {
  companyId: Types.ObjectId;
  stage: string;
  step: string;
}

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
