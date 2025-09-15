import type { NextFunction, Request, Response } from "express";
import {
  LoginDTO,
  RegisterDTO,
  ResendOtpDTO,
  VerifyAccountDTO,
} from "./auth.dto";
import {
  ConflictException,
  NotAuthorizedException,
  TooManyRequestsException,
} from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { sendMail } from "../../utils";
import { compareHash } from "../../utils";
import { generateAccessToken, generateRefreshToken } from "../../utils";
import { generateExpiryDate, generateOTP } from "../../utils";

class AuthService {
  private userRepository = new UserRepository();
  private authFactoryService = new AuthFactoryService();
  constructor() {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    //get data from req
    const registerDTO: RegisterDTO = req.body;

    //check user existance
    const userExist = await this.userRepository.exist({
      email: registerDTO.email,
    });
    if (userExist) {
      throw new ConflictException("user already exist");
    }
    //prepare data >>  user document >> hashing - encryption
    const user = await this.authFactoryService.register(registerDTO);
    //send email verify [otp]
    if (registerDTO.email) {
      sendMail(
        registerDTO.email,
        "Verify your email",
        `<p>your otp to verify your account is ${user.otp} </p>`
      );
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
  login = async (req: Request, res: Response, next: NextFunction) => {
    //get data from req
    const loginDTO: LoginDTO = req.body;
    //check userExist
    const userExist = await this.userRepository.exist({
      email: loginDTO.email,
    });
    if (!userExist) {
      throw new ConflictException("user not found");
    }
    if (userExist.isVerified === false) {
      throw new NotAuthorizedException("user not verified");
    }
    //compare password
    const match = compareHash(loginDTO.password, userExist.password);
    if (!match) {
      throw new NotAuthorizedException("invalid credentials");
    }
    //generate token
    const accessToken = generateAccessToken({ id: userExist.id });
    const refreshToken = generateRefreshToken({ id: userExist.id });
    //send response
    res.status(200).json({
      message: "user logged in successfully",
      success: true,
      data: { accessToken, refreshToken },
    });
  };
  verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    //get data from req
    const verifyAccountDTO: VerifyAccountDTO = req.body;
    //check user Exist
    const userExist = await this.userRepository.exist({
      email: verifyAccountDTO.email,
    });
    if (!userExist) {
      throw new ConflictException("invalid otp");
    }
    //check user is banned
    if (userExist.bannedUntil && userExist.bannedUntil.getTime() > Date.now()) {
      const minutesLeft = Math.ceil(
        (userExist.bannedUntil.getTime() - Date.now()) / 60000
      );
      throw new TooManyRequestsException(
        `you are banned . try again in ${minutesLeft} minutes`
      );
    }
    //check otp expire
    if (
      !userExist.otp ||
      (userExist.otpExpiryAt as Date).getTime() < Date.now()
    ) {
      throw new NotAuthorizedException("otp expired");
    }
    if (userExist.otp !== verifyAccountDTO.otp) {
      userExist.failedOtpAttempts = (userExist.failedOtpAttempts || 0) + 1;
      if ((userExist.failedOtpAttempts as number) >= 5) {
        userExist.bannedUntil = new Date(Date.now() + 5 * 60 * 1000);
      }
      await userExist.save();
      throw new NotAuthorizedException("invalid otp");
    }
    //update user
    userExist.isVerified = true;
    userExist.otp = undefined as unknown as string;
    userExist.otpExpiryAt = undefined as unknown as Date;
    userExist.failedOtpAttempts = 0;
    userExist.bannedUntil = undefined as unknown as Date;
    await userExist.save();
    //send response
    res.status(200).json({
      message: "user verified successfully",
      success: true,
    });
  };
  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    //get data from req
    const resendOtp: ResendOtpDTO = req.body;
    //chick user Exist
    const userExist = await this.userRepository.exist({
      email: resendOtp.email,
    });
    if (!userExist) {
      throw new ConflictException("user not found");
    }
    if (userExist.isVerified === false) {
      throw new NotAuthorizedException("user not verified");
    }
    //check user banned
    if (userExist.bannedUntil && userExist.bannedUntil.getTime() > Date.now()) {
      const minutesLeft = Math.ceil(
        (userExist.bannedUntil.getTime() - Date.now()) / 60000
      );
      throw new TooManyRequestsException(
        `you are banned . try again in ${minutesLeft} minutes`
      );
    }
    //generate new otp
    //  const {otp  , otpExpiryAt}= generateOTP()
    userExist.otp = generateOTP();
    userExist.otpExpiryAt = generateExpiryDate(
      5 * 60 * 1000
    ) as unknown as Date;
    userExist.failedOtpAttempts = 0;
    userExist.bannedUntil = undefined as unknown as Date;

    await userExist.save();
    //send email verify [otp]
    sendMail(
      userExist.email,
      "resend otp to verify your account",
      `<p>your new otp to verify your account is ${userExist.otp} </p>`
    );
    //send response
    res.status(200).json({
      message: "otp resend successfully",
      success: true,
    });
  };
}

export default new AuthService();
