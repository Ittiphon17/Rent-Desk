import { Request, Response } from "express";
import { listTenants, registerTenant } from "../services/tenant.service";
import { catchAsync } from "../utils/catchAsync";

export const getTenants = catchAsync(async (req: Request, res: Response) => {
  const tenants = await listTenants();
  return res.json(tenants);
});

export const createTenant = catchAsync(async (req: Request, res: Response) => {
  const tenant = await registerTenant(req.body);
  return res.status(201).json(tenant);
});