import { config } from "dotenv";
config();
export const devConfig = {
  DB_URL: process.env.DB_URL,
  PHONE_SECRET_KEY: process.env.PHONE_SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  ACCESS_EXPIRE: process.env.ACCESS_EXPIRE,
  REFRESH_EXPIRE: process.env.REFRESH_EXPIRE,

  //email
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
