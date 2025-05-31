// src\models\Company.ts
import { Document, model, Schema, Types} from 'mongoose';

export interface ICompany extends Document{
      _id: Types.ObjectId;
    name: string;
    industry: string; 
    targetMarket: string;
    description: string;
}
const CompanySchema = new Schema<ICompany>(
    {
        name: String,
        industry: String,
        targetMarket: String,
        description: String,
    }
    ,
    { timestamps: true }
);
const Company = model<ICompany>('Company', CompanySchema);
export default Company;