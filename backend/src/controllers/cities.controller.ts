import type { NextFunction, Request, Response } from "express";
import { citiesService } from "../services/cities.service";
import { sendError, sendSuccess } from "../types";

export const citiesController = {
  async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const cities = await citiesService.getAll();
      sendSuccess(res, "Cities fetched.", cities);
    } catch (error) {
      next(error);
    }
  },

  async getSubLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const cityId = req.params["cityId"] as string;
      const subLocations = await citiesService.getSublocations(cityId);
      sendSuccess(res, "Sublocation fetched", subLocations);
    } catch (error) {
      if (error instanceof Error && error.message == "City not found") {
        sendError(res, "City not found", 404);
        return;
      }
      next(error);
    }
  },
};
