import { FuelType, type TransmissionType } from "../../generated/prisma/enums";
import { prisma } from "../utils/prisma";

interface GetCarsInput {
  sublocationId: string;
  startTime: Date;
  endTime: Date;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  seats?: number;
}

export const carsService = {
  async getAvailableCard(input: GetCarsInput) {
    const { sublocationId, startTime, endTime, fuelType, transmission, seats } =
      input;

    const bookedCarIds = await prisma.booking.findMany({
      where: {
        car: { subLocationId: sublocationId },
        status: { in: ["CONFIRMED", "ACTIVE", "PENDING"] },
        OR: [
          { startTime: { gte: startTime, lt: endTime } },
          { endTime: { gt: startTime, lte: endTime } },
          { startTime: { lte: startTime }, endTime: { gte: endTime } },
        ],
      },

      select: {
        carId: true,
      },
    });

    const bookedIds = bookedCarIds.map((b) => b.carId);

    return prisma.car.findMany({
      where: {
        sublocation: sublocationId,
        status: "AVAILABLE",
        id: { notIn: bookedIds },
        ...(fuelType && { fuelType }),
        ...(transmission && { transmission }),
        ...(seats && { seats: { gte: seats } }),
      },
      include: {
        subLocation: {
          select: {
            id: true,
            name: true,
            address: true,
            city: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        pricePerDay: "asc",
      },
    });
  },

  async getCarById(id: string) {
    const car = await prisma.car.findUnique({
      where: {
        id,
      },
      include: {
        subLocation: {
          include: { city: true },
        },
      },
    });

    if (!car) throw new Error("Car not found");
    return car;
  },

  async calculatePrice(carId: string, startTime: Date, endTime: Date) {
    const car = await prisma.car.findUnique({
      where: {
        id: carId,
      },
    });

    if (!car) throw new Error("Car not found");

    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);

    let basePrice: number;
    if (hours <= 12) {
      basePrice = car.pricePerHour * hours;
    } else {
      basePrice = car.pricePerDay * days;
    }

    const kmLimitTotal = car.kmLimitPerDay * days;

    return {
      hours: Math.round(hours * 10) / 10,
      days,
      basePrice: Math.round(basePrice),
      kmLimitTotal,
      extraKmCharge: car.extraKmCharge,
      pricePerHour: car.pricePerHour,
      pricePerDay: car.pricePerDay,
    };
  },
};
