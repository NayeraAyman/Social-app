"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const router = (0, express_1.Router)();
router.post("/register", auth_service_1.default.register);
router.post("/login", auth_service_1.default.login);
router.post("/verify-account", auth_service_1.default.verifyAccount);
router.post("/resend-otp", auth_service_1.default.resendOtp);
exports.default = router;
