import { Router } from "express";
import { authController } from "../../controllers/auth.controllers";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/me", authenticate, authController.me);

export default router;
