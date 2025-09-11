import { SYS_ROLE, USER_AGENT } from "../../../utils/common/enum";
import { encryptPhone } from "../../../utils/encrypt";
import { generateHash } from "../../../utils/hash";
import { generateExpiryDate, generateOTP } from "../../../utils/otp";
import { User } from "../entity";
import { LoginDTO, RegisterDTO, ResendOtpDTO, VerifyAccountDTO } from "./../auth.dto";
export class AuthFactoryService {
  register(registerDTO: RegisterDTO) {
    const user = new User();
    user.fullName = registerDTO.fullName as string;
    user.email = registerDTO.email; 
    user.password = generateHash(registerDTO.password);
    if (registerDTO.phoneNumber) {
      user.phoneNumber = JSON.stringify(encryptPhone(registerDTO.phoneNumber));
    }
    user.otp = generateOTP();
    user.otpExpiryAt = generateExpiryDate(5 * 60 * 1000) as unknown as Date;
    user.credentialUpdatedAt = Date.now() as unknown as Date;
    user.gender = registerDTO.gender;
    user.role = SYS_ROLE.user;
    user.isVerified = false;
    user.userAgent = USER_AGENT.local;
    return user;
  }

  login(loginDTO: LoginDTO) {
    const user = new User();
    user.email = loginDTO.email;
    user.password = loginDTO.password;
    return user;
  }
  verifyAccount(verifyAccountDTO : VerifyAccountDTO){
    const user = new User();
    user.email = verifyAccountDTO.email;
    user.otp = verifyAccountDTO.otp;
    return user;
  }
  resendOtp(resendOtpDTO : ResendOtpDTO){
    const user = new User();
    user.email = resendOtpDTO.email;
    return user;
  }
}
