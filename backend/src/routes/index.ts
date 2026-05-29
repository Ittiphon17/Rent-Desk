import { Router } from "express";
import roomRoutes from "./room.routes";
import tenantRoutes from "./tenant.routes";

const router = Router();

router.use("/rooms", roomRoutes);
router.use("/tenants", tenantRoutes);

export default router;
