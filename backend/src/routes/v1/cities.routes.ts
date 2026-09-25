import { Router } from "express";
import { citiesController } from "../../controllers/cities.controller";

const router = Router();

router.get("/", citiesController.getCities);
router.get("/:cityId/sublocations", citiesController.getSubLocations);

export default router;
