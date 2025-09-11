"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPhone = encryptPhone;
exports.decryptPhone = decryptPhone;
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = "aes-256-cbc";
const KEY = Buffer.from(process.env.PHONE_SECRET_KEY || "", "utf-8");
// encryption
function encryptPhone(phone) {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(phone, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
        iv: iv.toString("hex"),
        content: encrypted,
    };
}
// decryption
function decryptPhone(hash) {
    const iv = Buffer.from(hash.iv, "hex");
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(hash.content, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
