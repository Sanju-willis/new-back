// src\controllers\syncController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthUserReq } from '@/interfaces/AuthUser';
import { findCompanyById, updateCompanyById, getCompanyItems, updateItemById, createItemForCompany,
  deleteItemById,} from '@/services/syncService';
import { UnauthorizedError, BadRequestError, NotFoundError } from '@/errors/Errors';


export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;

    if (!user?.companyId) throw new UnauthorizedError('Missing companyId');


  const company = await findCompanyById(user.companyId);

   if (!company) throw new NotFoundError('Company not found');


  res.json(company);
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;

   if (!user?.companyId) throw new UnauthorizedError('Missing companyId');


  const updated = await updateCompanyById(user.companyId, req.body);
  res.json(updated);
});

export const getItems = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;

    if (!user?.companyId) throw new UnauthorizedError();


  const items = await getCompanyItems(user.companyId);
  res.json(items);
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  const { _id, name, type, ...rest } = req.body;

   if (!user?.companyId) throw new UnauthorizedError('Missing companyId');
  if (!_id || !name || !type) throw new BadRequestError('Missing item ID, name, or type');

  const updated = await updateItemById(user.companyId, _id, { name, type, ...rest });

  if (!updated) throw new NotFoundError('Item not found or unauthorized');

  res.json(updated);
});

export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  if (!user?.companyId) throw new UnauthorizedError('Missing companyId');

  const { name, type, ...rest } = req.body;
  if (!name || !type) throw new BadRequestError('Missing item name or type');

  const item = await createItemForCompany(user.companyId, { name, type, ...rest });
  res.status(201).json(item);
});

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthUserReq).user;
  const { id } = req.params;

  if (!user?.companyId) throw new UnauthorizedError('Missing companyId');
  if (!id) throw new BadRequestError('Missing item ID');

  const deleted = await deleteItemById(user.companyId, id);
  if (!deleted) throw new NotFoundError('Item not found');

  res.json({ success: true });
});