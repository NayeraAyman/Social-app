"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const utils_3 = require("../../../utils");
const utils_4 = require("../../../utils");
const entity_1 = require("../entity");
class AuthFactoryService {
    async register(registerDTO) {
        const user = new entity_1.User();
        user.fullName = registerDTO.fullName;
        user.email = registerDTO.email;
        user.password = await (0, utils_3.generateHash)(registerDTO.password);
        if (registerDTO.phoneNumber) {
            user.phoneNumber = JSON.stringify((0, utils_2.encryptPhone)(registerDTO.phoneNumber));
        }
        user.otp = (0, utils_4.generateOTP)();
        user.otpExpiryAt = (0, utils_1.generateExpiryDate)(5 * 60 * 1000);
        user.credentialUpdatedAt = Date.now();
        user.gender = registerDTO.gender;
        user.role = utils_1.SYS_ROLE.user;
        user.isVerified = false;
        user.userAgent = utils_1.USER_AGENT.local;
        return user;
    }
}
exports.AuthFactoryService = AuthFactoryService;
