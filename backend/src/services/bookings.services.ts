import { BookingStatus } from "../../generated/prisma/enums";
import { logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

interface CreateBookingInput {
  userId: string;
  carId: string;
  startTime: Date;
  endTime: Date;
}

export const bookingService = {
  async createBooking(input: CreateBookingInput) {
    const { userId, carId, startTime, endTime } = input;

    const car = await prisma.car.findUnique({
      where: {
        id: carId,
      },
      include: {
        subLocation: { include: { city: true } },
      },
    });

    if (!car) throw new Error("Car not found.");

    if (car.status === "MAINTENANCE")
      throw new Error("Car is under maintenance.");

    const overlap = await prisma.booking.findFirst({
      where: {
        carId,
        status: {
          in: ["PENDING", "CONFIRMED", "ACTIVE"],
        },
        OR: [
          { startTime: { gte: startTime, lt: endTime } },
          { endTime: { gt: startTime, lte: endTime } },
          { startTime: { lte: startTime }, endTime: { gte: endTime } },
        ],
      },
    });

    if (overlap)
      throw new Error("Car is not available for the selected time slot.");

    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);
    const basePrice =
      hours <= 12 ? car.pricePerHour * hours : car.pricePerDay * days;
    const totalPrice = Math.round(basePrice);
    const kmLimitTotal = car.kmLimitPerDay * days;

    const booking = await prisma.$transaction(async (tx) => {
      const txOverlap = await tx.booking.findFirst({
        where: {
          carId,
          status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
          OR: [
            { startTime: { gte: startTime, lte: endTime } },
            { endTime: { gt: startTime, lt: endTime } },
            { startTime: { lte: startTime }, endTime: { gte: endTime } },
          ],
        },
      });

      if (overlap)
        throw new Error("Car is not available for selected time slot.");

      return tx.booking.create({
        data: {
          userId,
          carId,
          startTime,
          endTime,
          status: BookingStatus.CONFIRMED,
          totalHours: Math.round(hours * 10) / 10,
          basePrice: Math.round(basePrice),
          totalPrice,
          kmLimitTotal,
          pickupAddress: car.subLocation.address,
        },
        include: {
          car: {
            include: {
              subLocation: {
                include: {
                  city: true,
                },
              },
            },
          },
        },
      });
    });

    logger.info(`Booking created: ${booking.id} for user ${userId}`);
    return booking;
  },

  async userBookings(userId: string, status?: BookingStatus) {
    return prisma.booking.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
            images: true,
            fuelType: true,
            transmission: true,
            seats: true,
            subLocation: {
              select: {
                name: true,
                address: true,
                city: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },

      orderBy: { createdAt: "desc" },
    });
  },

  async getBookingByID(bookingId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        car: {
          include: {
            subLocation: { include: { city: true } },
          },
        },
      },
    });

    if (!booking) throw new Error("Booking is not found.");
    if (booking.userId !== userId) throw new Error("Unauthorized");

    return booking;
  },

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.userId != userId) throw new Error("Unauthorized");
    if (booking.status === "CANCELLED")
      throw new Error("Booking already cancelled");
    if (booking.status === "COMPLETED")
      throw new Error("Cannot cancel completed booking");
    if (booking.status === "ACTIVE")
      throw new Error("Cannot cancel active booking");

    const hoursUntilStart =
      (booking.startTime.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilStart < 1)
      throw new Error(
        "Cannot cancel booking less than 1 hour before start time",
      );

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });

    logger.info(`Booking cancelled: ${bookingId} by user ${userId}`);
    return updated;
  },
};
