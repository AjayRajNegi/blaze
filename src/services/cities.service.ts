import { api } from "@/lib/axios";
import { City, Sublocations } from "@/types";

export const citiesService = {
  async getCities(): Promise<City> {
    const res = await api.get("/cities");
    return res.data.data;
  },

  async getSublocations(cityId: string): Promise<Sublocations> {
    const res = await api.get(`/cities/${cityId}/sublocations`);
    return res.data.data;
  },
};
