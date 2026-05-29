import { Router } from "express";
import { getRoomsReport } from "../controllers/room.controller";

const router = Router();

router.get("/", getRoomsReport);

export default router;
