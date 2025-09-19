import { GENDER } from "../../utils";

export interface RegisterDTO {
  fullName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  gender: GENDER;
}
export interface LoginDTO {
  email: string;
  password: string;
}

export interface VerifyAccountDTO {
  email: string;
  otp: string;
}
export interface ResendOtpDTO {
  email: string;
}
export interface ForgetPasswordDTO {
    email:string
}
export interface ResetPasswordDTO {
    email:string
    password:string
}
export interface UpdateUserDto extends Partial<RegisterDTO> {}
