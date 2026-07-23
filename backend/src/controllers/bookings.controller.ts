import type { NextFunction, Response } from "express";
import z from "zod";
import { bookingService } from "../services/bookings.services";
import { sendError, type AuthenticatedRequest } from "../types";

const createBookingSchema = z.object({
  carId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const bookingsController = {
  async createBooking(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const input = createBookingSchema.parse(req.body);
      const startTime = new Date(input.startTime);
      const endTime = new Date(input.endTime);

      if (endTime <= startTime) {
        sendError(res, "End this must be after start time", 400);
        return;
      }
      const hours =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      if (hours < 1) {
        sendError(res, "Minimum booking duration is 1 hour", 400);
        return;
      }

      if (startTime < new Date()) {
        sendError(res, "Start Time cannot be in the past.", 400);
        return;
      }

      const booking = await bookingService.createBooking({
        userId: req.user!.userId,
        carId: input.carId,
        startTime,
        endTime,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("not available") ||
          error.message.includes("not found")
        ) {
          sendError(res, error.message, 400);
        }
        if (error.message.includes("maintenance")) {
          sendError(res, error.message, 400);
          return;
        }
      }
      next(error);
    }
  },
};
