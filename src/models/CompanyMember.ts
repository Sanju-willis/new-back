// src\models\CompanyMember.ts
import {Schema, model, Document, Types} from 'mongoose';	

export interface ICompanyMember extends Document {
    userId: Types.ObjectId;
    companyId: Types.ObjectId;
    role: string;
}

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