"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../utils/error");
const user_repository_1 = require("../../DB/model/user/user.repository");
const factory_1 = require("./factory");
const email_1 = require("../../utils/email");
const hash_1 = require("../../utils/hash");
const token_1 = require("../../utils/token");
const otp_1 = require("../../utils/otp");
class AuthService {
    userRepository = new user_repository_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() { }
    register = async (req, res, next) => {
        //get data from req
        const registerDTO = req.body;
        //check user existance
        const userExist = await this.userRepository.exist({
            email: registerDTO.email,
        });
        if (userExist) {
            throw new error_1.ConflictException("user already exist");
        }
        //prepare data >>  user document >> hashing - encryption
        const user = this.authFactoryService.register(registerDTO);
        //send email verify [otp]
        if (registerDTO.email) {
            (0, email_1.sendMail)(registerDTO.email, "Verify your email", `<p>your otp to verify your account is ${user.otp} </p>`);
        }
        //save into db
        const createdUser = await this.userRepository.create(user);
        //send response
        res.status(201).json({
            message: "user created successfully",
            success: true,
            data: createdUser,
        });
    };
    login = async (req, res, next) => {
        //get data from req
        const loginDTO = req.body;
        //check userExist
        const userExist = await this.userRepository.exist({
            email: loginDTO.email,
        });
        if (!userExist) {
            throw new error_1.ConflictException("user not found");
        }
        if (userExist.isVerified === false) {
            throw new error_1.NotAuthorizedException("user not verified");
        }
        //compare password
        const match = (0, hash_1.compareHash)(loginDTO.password, userExist.password);
        if (!match) {
            throw new error_1.NotAuthorizedException("invalid credentials");
        }
        //generate token
        const accessToken = (0, token_1.generateAccessToken)({ id: userExist.id });
        const refreshToken = (0, token_1.generateRefreshToken)({ id: userExist.id });
        //send response
        res.status(200).json({
            message: "user logged in successfully",
            success: true,
            data: { accessToken, refreshToken },
        });
    };
    verifyAccount = async (req, res, next) => {
        //get data from req
        const verifyAccountDTO = req.body;
        //check user Exist
        const userExist = await this.userRepository.exist({
            email: verifyAccountDTO.email,
        });
        if (!userExist) {
            throw new error_1.ConflictException("invalid otp");
        }
        //check user is banned
        if (userExist.bannedUntil && userExist.bannedUntil.getTime() > Date.now()) {
            const minutesLeft = Math.ceil((userExist.bannedUntil.getTime() - Date.now()) / 60000);
            throw new error_1.TooManyRequestsException(`you are banned . try again in ${minutesLeft} minutes`);
        }
        //check otp expire
        if (!userExist.otp ||
            userExist.otpExpiryAt.getTime() < Date.now()) {
            throw new error_1.NotAuthorizedException("otp expired");
        }
        if (userExist.otp !== verifyAccountDTO.otp) {
            userExist.failedOtpAttempts = (userExist.failedOtpAttempts || 0) + 1;
            if (userExist.failedOtpAttempts >= 5) {
                userExist.bannedUntil = new Date(Date.now() + 5 * 60 * 1000);
            }
            await userExist.save();
            throw new error_1.NotAuthorizedException("invalid otp");
        }
        //update user
        userExist.isVerified = true;
        userExist.otp = undefined;
        userExist.otpExpiryAt = undefined;
        userExist.failedOtpAttempts = 0;
        userExist.bannedUntil = undefined;
        await userExist.save();
        //send response
        res.status(200).json({
            message: "user verified successfully",
            success: true,
        });
    };
    resendOtp = async (req, res, next) => {
        //get data from req
        const resendOtp = req.body;
        //chick user Exist
        const userExist = await this.userRepository.exist({
            email: resendOtp.email,
        });
        if (!userExist) {
            throw new error_1.ConflictException("user not found");
        }
        if (userExist.isVerified === false) {
            throw new error_1.NotAuthorizedException("user not verified");
        }
        //check user banned
        if (userExist.bannedUntil && userExist.bannedUntil.getTime() > Date.now()) {
            const minutesLeft = Math.ceil((userExist.bannedUntil.getTime() - Date.now()) / 60000);
            throw new error_1.TooManyRequestsException(`you are banned . try again in ${minutesLeft} minutes`);
        }
        //generate new otp
        //  const {otp  , otpExpiryAt}= generateOTP()
        userExist.otp = (0, otp_1.generateOTP)();
        userExist.otpExpiryAt = (0, otp_1.generateExpiryDate)(5 * 60 * 1000);
        userExist.failedOtpAttempts = 0;
        userExist.bannedUntil = undefined;
        await userExist.save();
        //send email verify [otp]
        (0, email_1.sendMail)(userExist.email, "resend otp to verify your account", `<p>your new otp to verify your account is ${userExist.otp} </p>`);
        //send response
        res.status(200).json({
            message: "otp resend successfully",
            success: true,
        });
    };
}
exports.default = new AuthService();
