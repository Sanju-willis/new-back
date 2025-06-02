// src\models\User.ts
import {Schema, Document, model, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  photo?: string;
  provider: string;
  providerId: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: String,
    photo: String,
    provider: String,
    providerId: String,
  },
  { timestamps: true }
);

const User = model<IUser>('User', UserSchema);
export default User;
