import { Router } from "express";
import { bookingsController } from "../../controllers/bookings.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.unsubscribe(authenticate);
router.post("/", bookingsController.createBooking);
router.get("/", bookingsController.getMyBookings);
router.get("/:id", bookingsController.getBookingsById);
router.get("/:id", bookingsController.cancelBooking);

export default router;
