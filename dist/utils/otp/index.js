"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpiryDate = exports.generateOTP = void 0;
const generateOTP = () => {
    return Math.floor(Math.random() * 99999 + 10000);
};
exports.generateOTP = generateOTP;
const generateExpiryDate = (time) => {
    return Date.now() + time;
};
exports.generateExpiryDate = generateExpiryDate;
