import { Request, Response } from "express";
import { getRoomsSummary } from "../services/room.service";
import { catchAsync } from "../utils/catchAsync";

export const getRoomsReport = catchAsync(async (req: Request, res: Response) => {
  const report = await getRoomsSummary();
  return res.json(report);
});
