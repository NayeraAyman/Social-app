import { z } from "zod";
import {
  LoginDTO,
  RegisterDTO,
  ResendOtpDTO,
  ResetPasswordDTO,
  VerifyAccountDTO,
} from "./auth.dto";
import { GENDER } from "../../utils";

export const registerSchema = z.object<RegisterDTO>({
  fullName: z.string().min(2).max(20) as unknown as string,
  email: z.email() as unknown as string,
  password: z.string().min(6).max(50) as unknown as string,
  gender: z.enum(GENDER).optional() as unknown as GENDER,
  phoneNumber: z.string().optional() as unknown as string,
});
export const loginSchema = z.object<LoginDTO>({
  email: z.email() as unknown as string,
  password: z.string().min(6).max(50) as unknown as string,
});
export const verifyAccountSchema = z.object<VerifyAccountDTO>({
  email: z.email() as unknown as string,
  otp: z.string().min(5).max(5) as unknown as string,
});
export const resendOtpSchema = z.object<ResendOtpDTO>({
  email: z.email() as unknown as string,
});
export const resetPasswordSchema = z.object<ResetPasswordDTO>({
  email: z.email() as unknown as string,
  otp: z.string().min(5).max(5) as unknown as string,
  password: z.string().min(6).max(50) as unknown as string,
});
