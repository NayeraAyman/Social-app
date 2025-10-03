import { NextFunction, Request, Response, type Express } from "express";
import { connectDB } from "./DB";
import { AppError } from "./utils/error";
import { authRouter, userRouter, postRouter, commentRouter } from "./module";
export function bootstarp(app: Express, express: any) {
  connectDB();
  app.use(express.json());
  //auth
  app.use("/auth", authRouter);
  //user
  app.use("/user", userRouter);

  //posts
  app.use("/post", postRouter);
  //comments
  //messages
  app.use("/{*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "invalid router", success: false });
  });
  //global error handler
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode =
      error instanceof AppError && error.statusCode ? error.statusCode : 500;

    return res.status(statusCode).json({
      message: error.message || "Internal Server Error",
      success: false,
      errorDetails: error.errorDetails || null,
    });
  });
}
