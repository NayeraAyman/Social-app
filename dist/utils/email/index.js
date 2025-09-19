"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dev_config_1 = require("../../config/env/dev.config");
async function sendMail(to, subject, html) {
    //create transporter
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: dev_config_1.devConfig.EMAIL_USER,
            pass: dev_config_1.devConfig.EMAIL_PASS,
        },
    });
    //send mail
    await transporter.sendMail({
        from: `"social app"<${dev_config_1.devConfig.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
    });
}
