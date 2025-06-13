// src\interfaces\models\ICompanyMember.ts
import { Types, Document } from 'mongoose';

export interface ICompanyMember extends Document {
    userId: Types.ObjectId;
    companyId: Types.ObjectId;
    role: string;
}