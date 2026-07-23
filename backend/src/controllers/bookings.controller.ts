import type { NextFunction, Response } from "express";
import z from "zod";
import type { BookingStatus } from "../../generated/prisma/enums";
import { bookingService } from "../services/bookings.services";
import { sendError, sendSuccess, type AuthenticatedRequest } from "../types";

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

      sendSuccess(res, "Booking confirmed", booking, 201);
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

  async getMyBookings(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { status } = req.query;
      const bookings = await bookingService.userBookings(
        req.user!.userId,
        status as BookingStatus | undefined,
      );

      sendSuccess(res, "Bookings fetched", bookings);
    } catch (error) {
      next(error);
    }
  },

  async getBookingsById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params["id"] as string;
      const booking = await bookingService.getBookingByID(id, req.user!.userId);
      sendSuccess(res, "Booking fetched", booking);
    } catch (error) {
      if (error instanceof Error && error.message === "Booking not found") {
        sendError(res, "Booking not found", 404);
        return;
      }
      if (error instanceof Error && error.message === "Unauthorized") {
        sendError(res, "Unauthorized", 403);
        return;
      }
      next(error);
    }
  },

  async cancelBooking(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params["id"] as string;
      const booking = await bookingService.cancelBooking(id, req.user!.userId);
      sendSuccess(res, "Booking cancelled", booking);
    } catch (error) {
      if (error instanceof Error) {
        const clientErrors = [
          "Booking not found",
          "already cancelled",
          "cannot cancel",
          "less than 1 hour",
        ];

        if (clientErrors.some((e) => error.message.includes(e))) {
          sendError(res, error.message, 400);
          return;
        }

        if (error.message === "Unauthorized") {
          sendError(res, "Unauthorized", 403);
          return;
        }
        next(error);
      }
    }
  },
};
