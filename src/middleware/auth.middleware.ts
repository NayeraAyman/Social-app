import { NextFunction, Request, Response } from "express";
import {
  NotFoundException,
  UnAuthorizedException,
  verifyToken,
} from "../utils";
import { UserRepository } from "../DB";

export const isAuthenticated = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    if (!token) {
      throw new UnAuthorizedException("token is required");
    }
    const payload = verifyToken(token);
    const userRepository = new UserRepository();
    const blockedToken = await userRepository.exist({ token, type: "access" });
    if (blockedToken) throw new UnAuthorizedException("invalid token");
    const user = await userRepository.exist({ _id: payload._id });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    if (user.credentialUpdatedAt > new Date((payload.iat as number) * 1000)) {
      throw new UnAuthorizedException("token expired");
    }
    req.user = user;
    next();
  };
};
