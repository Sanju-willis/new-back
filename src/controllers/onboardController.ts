// src\controllers\onboardController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthUserReq } from '../interfaces/AuthUser';
import { createBasicCompany } from '../services/onboardSerivce';
import { syncDispatcher } from '../jobs/syncDispatcher';

export const createCompanyController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as Request & AuthUserReq).user;
  
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { companyName, industry, target_market, description, role } = req.body;

  try {
    const {company, progress} = await createBasicCompany(user._id, { companyName, industry, target_market, description, role });
    
syncDispatcher(company._id.toString(), user._id.toString());

    res.status(201).json({ company, progress });

    } catch (err: any) {
    if (err.message === 'CompanyExists') {
      res.status(400).json({ error: 'Company already exists' });
    } else {
      throw err;
    }
  }
});