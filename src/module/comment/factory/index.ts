import { IComment, IPost, IUser } from "../../../utils";
import { CreateCommentDto } from "../comment.dto";
import { Comment } from "../entity";

export class CommenFactoryService {
  createComment(
    createCommentDto: CreateCommentDto,
    user: IUser,
    post: IPost,
    comment?: IComment
  ) {
    const newComment = new Comment();
    newComment.userId = user._id;
    newComment.postId = post._id;
    newComment.parentId = comment? [...comment.parentId,comment._id]:[];
    newComment.content = createCommentDto.content;
    newComment.reactions = [];
    return newComment;
  }
}
