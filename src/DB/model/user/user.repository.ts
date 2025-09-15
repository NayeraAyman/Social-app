import { FilterQuery } from "mongoose";
import { IUser } from "../../../utils";
import { AbstractRepository } from "../../abstarct.repository";
import { User } from "./user.model";

export class UserRepository extends AbstractRepository<IUser> {
  constructor() {
    super(User);
  }
  async getSpecificUser(filter: FilterQuery<IUser>) {
    return await this.getOne(filter);
  }
}
