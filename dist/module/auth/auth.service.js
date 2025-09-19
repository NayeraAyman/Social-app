"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_2 = require("../../utils");
const utils_3 = require("../../utils");
const utils_4 = require("../../utils");
const utils_5 = require("../../utils");
const auth_provider_1 = require("./provider/auth.provider");
class AuthService {
    userRepository = new DB_1.UserRepository();
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
            throw new utils_1.ConflictException("user already exist");
        }
        //prepare data >>  user document >> hashing - encryption
        const user = await this.authFactoryService.register(registerDTO);
        //save into db
        const createdUser = await this.userRepository.create(user);
        //send response
        res.status(201).json({
            message: "user created successfully",
            success: true,
            data: { id: createdUser.id },
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
            throw new utils_1.ConflictException("user not found");
        }
        if (userExist.isVerified === false) {
            throw new utils_1.NotAuthorizedException("user not verified");
        }
        //compare password
        const match = (0, utils_3.compareHash)(loginDTO.password, userExist.password);
        if (!match) {
            throw new utils_1.NotAuthorizedException("invalid credentials");
        }
        //generate token
        const accessToken = (0, utils_4.generateAccessToken)({ id: userExist.id });
        const refreshToken = (0, utils_4.generateRefreshToken)({ id: userExist.id });
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
        //check user is banned
        //check otp expire
        await auth_provider_1.authProvider.chechOtp(verifyAccountDTO);
        //update user
        await this.userRepository.update({ email: verifyAccountDTO.email }, {
            isVerified: true,
            otp: undefined,
            otpExpiryAt: undefined,
            failedOtpAttempts: 0,
            bannedUntil: undefined,
        });
        // await userExist.save();
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
            throw new utils_1.ConflictException("user not found");
        }
        if (userExist.isVerified === false) {
            throw new utils_1.NotAuthorizedException("user not verified");
        }
        //check user banned
        if (userExist.bannedUntil && userExist.bannedUntil.getTime() > Date.now()) {
            const minutesLeft = Math.ceil((userExist.bannedUntil.getTime() - Date.now()) / 60000);
            throw new utils_1.TooManyRequestsException(`you are banned . try again in ${minutesLeft} minutes`);
        }
        //generate new otp
        //  const {otp  , otpExpiryAt}= generateOTP()
        userExist.otp = (0, utils_5.generateOTP)();
        userExist.otpExpiryAt = (0, utils_5.generateExpiryDate)(5 * 60 * 1000);
        userExist.failedOtpAttempts = 0;
        userExist.bannedUntil = undefined;
        await userExist.save();
        //send email verify [otp]
        (0, utils_2.sendMail)(userExist.email, "resend otp to verify your account", `<p>your new otp to verify your account is ${userExist.otp} </p>`);
        //send response
        res.status(200).json({
            message: "otp resend successfully",
            success: true,
        });
    };
    forgetPassword = async (req, res, next) => {
    };
    resetPassword = async (req, res, next) => {
    };
}
exports.default = new AuthService();
