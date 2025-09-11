"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";
const ACCESS_EXPIRE = process.env.ACCESS_EXPIRE;
const REFRESH_EXPIRE = process.env.REFRESH_EXPIRE;
function generateAccessToken(payload) {
    const expiresIn = resolveExpiresIn(ACCESS_EXPIRE, process.env.ACCESS_EXPIRE);
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
function generateRefreshToken(payload) {
    const expiresIn = resolveExpiresIn(REFRESH_EXPIRE, process.env.REFRESH_EXPIRE);
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
