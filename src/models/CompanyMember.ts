// src\models\CompanyMember.ts
import {Schema, model, Document, Types} from 'mongoose';	
import {ICompanyMember } from '@/models/model-inter/inter';

const CompanyMemberSchema = new Schema<ICompanyMember>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User'},
        companyId: { type: Schema.Types.ObjectId, ref: 'Company'},
        role: String,
    },
        { timestamps: true }

);

const CompanyMember = model<ICompanyMember>('CompanyMember', CompanyMemberSchema);
export default CompanyMember;