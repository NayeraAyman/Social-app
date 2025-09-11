import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_URL as string)
    .then(() => {
      console.log("db connected successfully");
    })
    .catch((err) => {
      console.log("fail to connect to db", err);
    });
};
