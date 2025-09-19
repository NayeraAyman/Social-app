import { UserRepository } from "../../../DB";
import { ConflictException, NotAuthorizedException, TooManyRequestsException } from "../../../utils";
import { VerifyAccountDTO } from "../auth.dto";

export const authProvider =  {
   async chechOtp (verifyAccountDTO:VerifyAccountDTO){
        const userRepository = new UserRepository();
       const userExist = await userRepository.exist({
            email: verifyAccountDTO.email,
          });
          if (!userExist) {
            throw new ConflictException("invalid otp");
          }
          if (userExist.bannedUntil && userExist.bannedUntil.getTime() > Date.now()) {
                const minutesLeft = Math.ceil(
                  (userExist.bannedUntil.getTime() - Date.now()) / 60000
                );
                throw new TooManyRequestsException(
                  `you are banned . try again in ${minutesLeft} minutes`
                );
              }
              if (
                !userExist.otp ||
                (userExist.otpExpiryAt as Date).getTime() < Date.now()
              ) {
                throw new NotAuthorizedException("otp expired");
              }
              if (userExist.otp !== verifyAccountDTO.otp) {
                userExist.failedOtpAttempts = (userExist.failedOtpAttempts || 0) + 1;
                if ((userExist.failedOtpAttempts as number) >= 5) {
                  userExist.bannedUntil = new Date(Date.now() + 5 * 60 * 1000);
                }
                await userExist.save();
                throw new NotAuthorizedException("invalid otp");
              }
    }
};