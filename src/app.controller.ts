import { type Express } from "express";
import authRouter from "./module/auth/auth.controller";
import { connectDB } from "./DB/connection";
export function bootstarp(app: Express, express: any) {
  connectDB();
  app.use(express.json());
  //auth
  app.use("/auth", authRouter);
  //user
  //posts
  //coments
  //messages
  app.use("/{*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "invalid router", success: false });
  });
}
