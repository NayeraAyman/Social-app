import type { NextFunction, Request, Response } from "express";
import {
  LoginDTO,
  RegisterDTO,
  ResendOtpDTO,
  ResetPasswordDTO,
  VerifyAccountDTO,
} from "./auth.dto";
import {
  BadRequestException,
  ConflictException,
  generateHash,
  IUser,
  NotAuthorizedException,
  TooManyRequestsException,
} from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { sendMail } from "../../utils";
import { compareHash } from "../../utils";
import { generateAccessToken, generateRefreshToken } from "../../utils";
import { generateExpiryDate, generateOTP } from "../../utils";
import { authProvider } from "./provider/auth.provider";

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

    //save into db
    const createdUser = await this.userRepository.create(user as IUser);
    //send response
    res.status(201).json({
      message: "user created successfully",
      success: true,
      data: { id: createdUser.id },
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
    const match = await compareHash(loginDTO.password, userExist.password);
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

    //check otp expire
    await authProvider.chechOtp(verifyAccountDTO);
    //update user
    await this.userRepository.update(
      { email: verifyAccountDTO.email },
      {
        isVerified: true,
        otp: undefined as unknown as string,
        otpExpiryAt: undefined as unknown as Date,
        failedOtpAttempts: 0,
        bannedUntil: undefined as unknown as Date,
      }
    );
    // await userExist.save();
    //send response
    res.status(200).json({
      message: "user verified successfully",
      success: true,
    });
  };
  // resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  //   //get data from req
  //   const resendOtp: ResendOtpDTO = req.body;
  //   //chick user Exist
  //   const userExist = await this.userRepository.exist({
  //     email: resendOtp.email,
  //   });
  //   if (!userExist) {
  //     throw new ConflictException("user not found");
  //   }
  //   if (userExist.isVerified === false) {
  //     throw new NotAuthorizedException("user not verified");
  //   }
  //   //check user banned
  //   if (userExist.bannedUntil && userExist.bannedUntil.getTime() > Date.now()) {
  //     const minutesLeft = Math.ceil(
  //       (userExist.bannedUntil.getTime() - Date.now()) / 60000
  //     );
  //     throw new TooManyRequestsException(
  //       `you are banned . try again in ${minutesLeft} minutes`
  //     );
  //   }
  //   //generate new otp
  //   //  const {otp  , otpExpiryAt}= generateOTP()
  //   userExist.otp = generateOTP();
  //   userExist.otpExpiryAt = generateExpiryDate(
  //     5 * 60 * 1000
  //   ) as unknown as Date;
  //   userExist.failedOtpAttempts = 0;
  //   userExist.bannedUntil = undefined as unknown as Date;

  //   await userExist.save();
  //   //send email verify [otp]
  //  await sendMail(
  //     userExist.email,
  //     "resend otp to verify your account",
  //     `<p>your new otp to verify your account is ${userExist.otp} </p>`
  //   );
  //   //send response
  //   res.status(200).json({
  //     message: "otp resend successfully",
  //     success: true,
  //   });
  // };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    const resendOtp: ResendOtpDTO = req.body;

    const userExist = await this.userRepository.getOne({
      email: resendOtp.email,
    });
    if (!userExist) {
      throw new ConflictException("User not found");
    }

    if (userExist.isVerified === false) {
      throw new NotAuthorizedException("User not verified");
    }

    if (userExist.bannedUntil && userExist.bannedUntil.getTime() > Date.now()) {
      const minutesLeft = Math.ceil(
        (userExist.bannedUntil.getTime() - Date.now()) / 60000
      );
      throw new TooManyRequestsException(
        `You are banned. Try again in ${minutesLeft} minutes`
      );
    }

    // generate new otp
    userExist.otp = generateOTP() as unknown as string;
    userExist.otpExpiryAt = generateExpiryDate(
      5 * 60 * 1000
    ) as unknown as Date;
    userExist.failedOtpAttempts = 0;
    userExist.bannedUntil = undefined as unknown as Date;

    await userExist.save();

    // send email
    await sendMail(
      userExist.email,
      "Resend OTP to verify your account",
      `<p>Your new OTP to verify your account is <b>${userExist.otp}</b></p>`
    );

    res.status(200).json({
      message: "OTP resent successfully",
      success: true,
    });
  };
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const resetPasswordDTO: ResetPasswordDTO = req.body;

    const userExist = await this.userRepository.getOne(
      {
        email: resetPasswordDTO.email,
        otp: resetPasswordDTO.otp,
        otpExpiryAt: { $gt: Date.now() },
      },
      { isVerified: true }
    );

    if (!userExist) {
      throw new BadRequestException("Invalid or expired OTP");
    }

    userExist.password = await generateHash(resetPasswordDTO.password);
    userExist.credentialUpdatedAt = new Date();
    userExist.otp = null as any;
    userExist.otpExpiryAt = null as any;

    await userExist.save();

    res.status(200).json({
      message: "password reset successfully",
      success: true,
    });
  };
}

export default new AuthService();
