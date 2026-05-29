import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError" || err.name === "ZodError") {
    statusCode = 400;
    message = "Validation Error";
    errors = err.errors || err.format?.() || err;
  } else if (err.code === "P2002") {
    // Prisma unique constraint violation
    statusCode = 409;
    const fields = err.meta?.target || "field";
    message = `Duplicate value for: ${fields}`;
  } else if (err.code === "P2025") {
    // Prisma record not found
    statusCode = 404;
    message = err.meta?.cause || "Record not found";
  } else {
    // Log unexpected errors
    console.error("💥 Unexpected Error:", err);
  }

  const response: any = {
    status: "error",
    message,
    ...(errors && { errors }),
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
