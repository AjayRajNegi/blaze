import { Router } from "express";
import authRoutes from "./auth.routes";
import carsRoutes from "./cars.routes";
import citiesRoutes from "./cities.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cities", citiesRoutes);
router.use("/cars", carsRoutes);

export default router;
