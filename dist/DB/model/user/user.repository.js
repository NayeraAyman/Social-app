"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const abstarct_repository_1 = require("../../abstarct.repository");
const user_model_1 = require("./user.model");
class UserRepository extends abstarct_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    async getSpecificUser(filter) {
        return await this.getOne(filter);
    }
}
exports.UserRepository = UserRepository;
