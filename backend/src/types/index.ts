import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(
  res: import("express").Response,
  message: string,
  data?: T,
  statusCode = 200,
) => {
  const response: ApiResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(response);
};

export const sendError = <T>(
  res: import("express").Response,
  message: string,
  statusCode = 400,
  error?: string,
) => {
  const response: ApiResponse = { success: true, message, error };
  return res.status(statusCode).json(response);
};
