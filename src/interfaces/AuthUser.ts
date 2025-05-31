// src\interfaces\AuthUser.ts
import { Request } from 'express';

export interface AuthUserReq extends Request {
    user: {
       _id: string;
    name: string;
    email: string;
    photo?: string;
    companyId?: string;
  };  
    
}