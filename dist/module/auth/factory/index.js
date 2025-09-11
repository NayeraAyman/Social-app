"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const enum_1 = require("../../../utils/common/enum");
const encrypt_1 = require("../../../utils/encrypt");
const hash_1 = require("../../../utils/hash");
const otp_1 = require("../../../utils/otp");
const entity_1 = require("../entity");
class AuthFactoryService {
    register(registerDTO) {
        const user = new entity_1.User();
        user.fullName = registerDTO.fullName;
        user.email = registerDTO.email;
        user.password = (0, hash_1.generateHash)(registerDTO.password);
        if (registerDTO.phoneNumber) {
            user.phoneNumber = JSON.stringify((0, encrypt_1.encryptPhone)(registerDTO.phoneNumber));
        }
        user.otp = (0, otp_1.generateOTP)();
        user.otpExpiryAt = (0, otp_1.generateExpiryDate)(5 * 60 * 1000);
        user.credentialUpdatedAt = Date.now();
        user.gender = registerDTO.gender;
        user.role = enum_1.SYS_ROLE.user;
        user.isVerified = false;
        user.userAgent = enum_1.USER_AGENT.local;
        return user;
    }
    login(loginDTO) {
        const user = new entity_1.User();
        user.email = loginDTO.email;
        user.password = loginDTO.password;
        return user;
    }
    verifyAccount(verifyAccountDTO) {
        const user = new entity_1.User();
        user.email = verifyAccountDTO.email;
        user.otp = verifyAccountDTO.otp;
        return user;
    }
    resendOtp(resendOtpDTO) {
        const user = new entity_1.User();
        user.email = resendOtpDTO.email;
        return user;
    }
}
exports.AuthFactoryService = AuthFactoryService;
