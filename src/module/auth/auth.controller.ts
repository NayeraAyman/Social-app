import { Router } from "express";
import authService from "./auth.service";
import { isValid } from "../../middleware";
import * as authValidation from "./auth.validation";
const router = Router();

router.post(
  "/register",
  isValid(authValidation.registerSchema),
  authService.register
);
router.post("/login", authService.login);
router.post("/verify-account", authService.verifyAccount);
router.post("/resend-otp", authService.resendOtp);
router.post("/reset-password", authService.resetPassword);
export default router;
