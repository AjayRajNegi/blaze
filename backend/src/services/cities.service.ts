import { prisma } from "../utils/prisma";

export const citiesService = {
  async getAll() {
    return prisma.city.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        state: true,
        _count: {
          select: { subLocations: true },
        },
        orderBy: {
          name: "asc",
        },
      },
    });
  },

  async getSublocations(cityId: string) {
    const city = await prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!city) throw new Error("City is not found.");

    return prisma.subLocation.findMany({
      where: {
        cityId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,

        longitude: true,
        _count: {
          select: { car: true },
        },
        orderBy: {
          name: "asc",
        },
      },
    });
  },
};
