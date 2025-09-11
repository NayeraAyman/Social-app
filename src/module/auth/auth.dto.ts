import { GENDER } from "../../utils/common/enum";

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

export interface VerifyAccountDTO{
  email:string,
  otp:string
}
export interface ResendOtpDTO{
  email:string
}

export interface UpdateUserDto extends Partial<RegisterDTO> {}
