import { generateExpiryDate, SYS_ROLE, USER_AGENT } from "../../../utils";
import { encryptPhone } from "../../../utils";
import { generateHash } from "../../../utils";
import { generateOTP } from "../../../utils";
import { User } from "../entity";
import { RegisterDTO } from "./../auth.dto";
export class AuthFactoryService {
  async register(registerDTO: RegisterDTO) {
    const user = new User();
    user.fullName = registerDTO.fullName as string;
    user.email = registerDTO.email;
    user.password = await generateHash(registerDTO.password);
    if (registerDTO.phoneNumber) {
      user.phoneNumber = JSON.stringify(encryptPhone(registerDTO.phoneNumber));
    }
    user.otp = generateOTP() as unknown as string;
    user.otpExpiryAt = generateExpiryDate(5 * 60 * 1000) as unknown as Date;
    user.credentialUpdatedAt = Date.now() as unknown as Date;
    user.gender = registerDTO.gender;
    user.role = SYS_ROLE.user;
    user.isVerified = false;
    user.userAgent = USER_AGENT.local;
    return user;
  }
}
