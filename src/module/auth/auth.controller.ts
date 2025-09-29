import { Router } from "express";
import authService from "./auth.service";
import { isAuthenticated, isValid } from "../../middleware";
import * as authValidation from "./auth.validation";
const router = Router();

router.post(
  "/register",
  isValid(authValidation.registerSchema),
  authService.register
);
router.post("/login", isValid(authValidation.loginSchema), authService.login);
router.post(
  "/verify-account",
  isAuthenticated(),
  isValid(authValidation.verifyAccountSchema),
  authService.verifyAccount
);
router.post(
  "/resend-otp",
  isValid(authValidation.resendOtpSchema),
  authService.resendOtp
);
router.post(
  "/reset-password",
  isValid(authValidation.resetPasswordSchema),
  authService.resetPassword
);
export default router;
