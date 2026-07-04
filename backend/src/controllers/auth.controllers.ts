import type { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";
import { authService } from "../services/auth.service";
import { sendError, sendSuccess } from "../types";

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid Indian mobile number"),
  password: z.string().min(1).max(50),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const result = await authService.register(input);
      sendSuccess(res, "Registration successful", result, 201);
    } catch (error) {
      if (
        error instanceof ZodError &&
        error.message.includes("already registered")
      ) {
        sendError(res, error.message, 409);
        return;
      }
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await authService.login(input);
      sendSuccess(res, "Login successful", result, 201);
    } catch (error) {
      if (
        error instanceof ZodError &&
        error.message.includes("Invalid credentials")
      ) {
        sendError(res, error.message, 409);
        return;
      }
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = z
        .object({
          refreshToken: z.string(),
        })
        .parse(req.body);
      const result = await authService.refreshTokens(refreshToken);
      sendSuccess(res, "Token refreshed", result);
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = z
        .object({
          refreshToken: z.string(),
        })
        .parse(req.body);
      const result = await authService.refreshTokens(refreshToken);
      sendSuccess(res, "Log out successfull.", result);
    } catch (error) {
      next(error);
    }
  },
};
