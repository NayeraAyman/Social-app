"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const utils_1 = require("../utils");
const DB_1 = require("../DB");
const isAuthenticated = () => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new utils_1.UnAuthorizedException("token is required");
        }
        const payload = (0, utils_1.verifyToken)(token);
        const userRepository = new DB_1.UserRepository();
        const blockedToken = await userRepository.exist({ token, type: "access" });
        if (blockedToken)
            throw new utils_1.UnAuthorizedException("invalid token");
        const user = await userRepository.exist({ _id: payload._id });
        if (!user) {
            throw new utils_1.NotFoundException("user not found");
        }
        if (user.credentialUpdatedAt > new Date(payload.iat * 1000)) {
            throw new utils_1.UnAuthorizedException("token expired");
        }
        req.user = user;
        next();
    };
};
exports.isAuthenticated = isAuthenticated;
