"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
class UserService {
    userRepository = new DB_1.UserRepository();
    constructor() { }
    getUserProfile = async (req, res, next) => {
        let user = await this.userRepository.getOne({ _id: req.params.id });
        if (!user) {
            throw new utils_1.NotFoundException("user not found");
        }
        return res
            .status(200)
            .json({ message: "success", success: true, data: { user: req.user } });
    };
}
exports.default = new UserService();
