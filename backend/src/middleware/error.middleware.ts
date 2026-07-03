import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "../types";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
  });

  if (err instanceof ZodError) {
    const message = err.issues
      ?.map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    sendError(res, "Validation Error", 422, message);
    return;
  }

  if (err.name === "JsonWebTokenError") {
    sendError(res, "Invalid token", 401);
    return;
  }

  if (err.name === "TokenExpiredError") {
    sendError(res, "Token Expired", 401);
    return;
  }

  sendError(
    res,
    "Internal Server Error",
    500,
    process.env.NODE_ENV === "development" ? err.message : undefined,
  );
};
