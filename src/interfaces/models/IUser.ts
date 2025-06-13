// src\interfaces\models\IUser.ts
import { Types, Document } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  photo?: string;
  provider: string;
  providerId: string;
}