import { api } from "@/lib/axios";
import { Car } from "@/types";

export const carsService = {
  async getAvailableCars(params: {
    sublocationId: string;
    startTime: string;
    endTime: string;
    fuelType?: string;
    transmission?: string;
    seats?: number;
  }): Promise<Car[]> {
    const res = await api.get("/cars", { params });
    return res.data.data;
  },
  async getCarById(id: string): Promise<Car> {
    const res = await api.get(`/car/${id}`);
    return res.data.data;
  },
  async calculatePrice(params: {
    carId: string;
    startTime: string;
    endTime: string;
  }) {
    const res = await api.get("/cars/price", { params });
    return res.data.data;
  },
};
