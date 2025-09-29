"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.resendOtpSchema = exports.verifyAccountSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(20),
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6).max(50),
    gender: zod_1.z.enum(utils_1.GENDER).optional(),
    phoneNumber: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6).max(50),
});
exports.verifyAccountSchema = zod_1.z.object({
    email: zod_1.z.email(),
    otp: zod_1.z.string().min(5).max(5),
});
exports.resendOtpSchema = zod_1.z.object({
    email: zod_1.z.email(),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.email(),
    otp: zod_1.z.string().min(5).max(5),
    password: zod_1.z.string().min(6).max(50),
});
