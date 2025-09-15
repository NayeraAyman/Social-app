import { NextFunction, Request, Response, type Express } from "express";
import { connectDB } from "./DB";
import { AppError } from "./utils/error";
import { authRouter, userRouter } from "./module";
export function bootstarp(app: Express, express: any) {
  connectDB();
  app.use(express.json());
  //auth
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  //user
  //posts
  //coments
  //messages
  app.use("/{*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "invalid router", success: false });
  });
  app.use(
    (error: AppError, req: Request, res: Response, next: NextFunction) => {
      return res.status(error.stausCode).json({
        message: error.message,
        success: false,
        errorDetails: error.errorDetails,
      });
    }
  );
}
