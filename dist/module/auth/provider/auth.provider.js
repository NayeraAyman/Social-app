"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProvider = void 0;
const DB_1 = require("../../../DB");
const utils_1 = require("../../../utils");
exports.authProvider = {
    async chechOtp(verifyAccountDTO) {
        const userRepository = new DB_1.UserRepository();
        const userExist = await userRepository.exist({
            email: verifyAccountDTO.email,
        });
        if (!userExist) {
            throw new utils_1.ConflictException("invalid otp");
        }
        if (userExist.bannedUntil && userExist.bannedUntil.getTime() > Date.now()) {
            const minutesLeft = Math.ceil((userExist.bannedUntil.getTime() - Date.now()) / 60000);
            throw new utils_1.TooManyRequestsException(`you are banned . try again in ${minutesLeft} minutes`);
        }
        if (!userExist.otp ||
            userExist.otpExpiryAt.getTime() < Date.now()) {
            throw new utils_1.NotAuthorizedException("otp expired");
        }
        if (userExist.otp !== verifyAccountDTO.otp) {
            userExist.failedOtpAttempts = (userExist.failedOtpAttempts || 0) + 1;
            if (userExist.failedOtpAttempts >= 5) {
                userExist.bannedUntil = new Date(Date.now() + 5 * 60 * 1000);
            }
            await userExist.save();
            throw new utils_1.NotAuthorizedException("invalid otp");
        }
    },
};
