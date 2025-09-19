"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dev_config_1 = require("../../config/env/dev.config");
/**
 * Helper function to normalize expiresIn value
 */
function resolveExpiresIn(value, fallback) {
    if (!value)
        return fallback;
    if (/^\d+$/.test(value)) {
        return Number(value);
    }
    return value;
}
const JWT_SECRET = dev_config_1.devConfig.JWT_SECRET || "defaultSecret";
const ACCESS_EXPIRE = dev_config_1.devConfig.ACCESS_EXPIRE;
const REFRESH_EXPIRE = dev_config_1.devConfig.REFRESH_EXPIRE;
function generateAccessToken(payload) {
    const expiresIn = resolveExpiresIn(ACCESS_EXPIRE, dev_config_1.devConfig.ACCESS_EXPIRE);
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
function generateRefreshToken(payload) {
    const expiresIn = resolveExpiresIn(REFRESH_EXPIRE, dev_config_1.devConfig.REFRESH_EXPIRE);
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
