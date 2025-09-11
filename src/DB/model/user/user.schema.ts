import { Schema } from "mongoose";
import { IUser } from "../../../utils/common/interfaces";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils/common/enum";

export const userSchema = new Schema<IUser>(
  {
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
        if (this.userAgent == USER_AGENT.google) return false;
        return true;
      },
    },
    credentialUpdatedAt: Date,
    phoneNumber: String,
    role: { type: String, enum: SYS_ROLE, default: SYS_ROLE.user },
    gender: { type: String, enum: GENDER, default: GENDER.male },
    userAgent: { type: String, enum: USER_AGENT, default: USER_AGENT.local },
    otp: {
      type: String,
    },
    otpExpiryAt: {
      type: Date,
    },
    isVerified:{
      type:Boolean,
      default:false
    },
    failedOtpAttempts: {
      type: Number,
      default: 0,
    },
    bannedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema
  .virtual("fullName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (value: string) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName as string;
    this.lastName = lName as string;
  });
