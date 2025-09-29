"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
exports.userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            if (this.userAgent == utils_2.USER_AGENT.google)
                return false;
            return true;
        },
    },
    credentialUpdatedAt: Date,
    phoneNumber: String,
    role: { type: Number, enum: utils_2.SYS_ROLE, default: utils_2.SYS_ROLE.user },
    gender: { type: Number, enum: utils_2.GENDER, default: utils_2.GENDER.male },
    userAgent: { type: Number, enum: utils_2.USER_AGENT, default: utils_2.USER_AGENT.local },
    otp: {
        type: String,
    },
    otpExpiryAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    failedOtpAttempts: {
        type: Number,
        default: 0,
    },
    bannedUntil: {
        type: Date,
        default: null,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.userSchema
    .virtual("fullName")
    .get(function () {
    return this.firstName + " " + this.lastName;
})
    .set(function (value) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName;
    this.lastName = lName;
});
exports.userSchema.pre("save", async function () {
    if (this.userAgent != utils_2.USER_AGENT.google && this.isNew == true)
        await (0, utils_1.sendMail)(this.email, "Verify your email", `<p>your otp to verify your account is ${this.otp} </p>`);
});
