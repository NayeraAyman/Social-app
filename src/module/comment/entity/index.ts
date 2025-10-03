import { IReaction, IAttachment } from "../../../utils";
import { ObjectId } from "mongoose";

export class Comment {
  userId: ObjectId;
  postId: ObjectId;
  parentId: ObjectId[];
  content: string;
  attachments?: IAttachment;
  reactions: IReaction[];
  mentions?: ObjectId[];
}
