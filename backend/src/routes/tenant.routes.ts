import { Router } from "express";
import {
  getTenants,
  createTenant,
} from "../controllers/tenant.controller";
import { validate } from "../middlewares/validation";
import { createTenantSchema } from "../validators/tenant.validator";

const router = Router();

router.get("/", getTenants);
router.post("/", validate(createTenantSchema), createTenant);

export default router;