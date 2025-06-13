// src\controllers\syncController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { findCompanyById, updateCompanyById, getCompanyItems, updateItemById,} from '@/services/syncService';

export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;

  if (!user?.companyId) {
    res.status(401).json({ message: 'Unauthorized or missing companyId' });
    return;
  }

  const company = await findCompanyById(user.companyId);

  if (!company) {
    res.status(404).json({ message: 'Company not found' });
    return;
  }

  res.json(company);
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;

  if (!user?.companyId) {
    res.status(401).json({ message: 'Unauthorized or missing companyId' });
    return;
  }

  const updated = await updateCompanyById(user.companyId, req.body);
  res.json(updated);
});

export const getItems = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;

  if (!user?.companyId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const items = await getCompanyItems(user.companyId);
  res.json(items);
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  const { _id, name, type, ...rest } = req.body;

  if (!user?.companyId || !_id || !name || !type) {
    res.status(400).json({ message: 'Missing item ID, name, type, or companyId' });
    return;
  }

  const updated = await updateItemById(user.companyId, _id, { name, type, ...rest });

  if (!updated) {
    res.status(404).json({ message: 'Item not found or unauthorized' });
    return;
  }

  res.json(updated);
});
