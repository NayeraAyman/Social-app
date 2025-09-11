import { model } from "mongoose";
import { userSchema } from "./user.schema";
import { IUser } from "../../../utils/common/interfaces";

export const User = model<IUser>("User",userSchema)