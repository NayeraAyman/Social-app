import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB";
import { NotFoundException } from "../../utils";

class UserService {
  private readonly userRepository = new UserRepository();
  constructor() {}
  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    let user = await this.userRepository.getOne({ _id: req.params.id });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return res
      .status(200)
      .json({ message: "success", success: true, data: { user: req.user } });
  };
}

export default new UserService();
