import { JwtPayload } from "jsonwebtoken";
import { GENDER, REACTION, SYS_ROLE, USER_AGENT } from "../enum";
import { Request } from "express";
import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  password: string;
  credentialUpdatedAt: Date;
  phoneNumber?: string;
  role: SYS_ROLE;
  gender: GENDER;
  userAgent: USER_AGENT;
  otp?: string;
  otpExpiryAt?: Date;
  isVerified?: boolean;
  failedOtpAttempts?: number;
  bannedUntil?: Date;
}
export interface IAttachment {
  id: string;
  url: string;
}
export interface IReaction {
  userId: ObjectId;
  reaction: REACTION;
}
export interface IPost {
  _id: ObjectId;
  userId: ObjectId;
  content: string;
  reactions: IReaction[];
  attachments?: IAttachment[];
}

export interface IPayload extends JwtPayload {
  _id: string;
  role: SYS_ROLE;
}

export interface IComment {
  _id: ObjectId;
  userId: ObjectId;
  postId: ObjectId;
  parentId: ObjectId[];
  content:string;
  attachments:IAttachment;
  reactions:IReaction[];
  mentions?:ObjectId[];
}

declare module "express" {
  interface Request {
    user: IUser;
  }
}
