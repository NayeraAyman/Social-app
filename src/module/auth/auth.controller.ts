import { Router } from "express";
import authService from "./auth.service";
const router = Router();

router.post("/register", authService.register);
router.post("/login", authService.login);
router.post("/verify-account", authService.verifyAccount);
router.post("/resend-otp", authService.resendOtp);
export default router;
