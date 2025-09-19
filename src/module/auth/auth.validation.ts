import { z } from "zod";
import { RegisterDTO } from "./auth.dto";
import { GENDER } from "../../utils";

export const registerSchema = z.object<RegisterDTO>({
  fullName: z.string().min(2).max(20) as unknown as string,
  email: z.email() as unknown as string,
  password: z.string().min(6).max(50) as unknown as string,
  gender: z.enum(GENDER).optional() as unknown as GENDER,
  phoneNumber: z.string().optional() as unknown as string,
});
