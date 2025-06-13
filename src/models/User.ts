// src\models\User.ts
import {Schema, Document, model, Types } from 'mongoose';
import {IUser } from '@/interfaces/models/IUser';


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
