import { NextFunction, Request, Response } from "express";
import { CommentRepository, PostRepository } from "../../DB";
import { IComment, NotFoundException } from "../../utils";
import { CommenFactoryService } from "./factory";
import { CreateCommentDto } from "./comment.dto";

class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
  private readonly commentFactoryService = new CommenFactoryService();
  constructor() {}
  public createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { postId, id } = req.params;
    const createCommentDto: CreateCommentDto = req.body;
    const postExist = await this.postRepository.exist({ _id: postId });
    if (!postExist) {
      throw new NotFoundException("Post not found");
    }
    let commentExist: any | IComment = undefined;
    if (id) {
      commentExist = await this.commentRepository.exist({ _id: id });
      if (!commentExist) {
        throw new NotFoundException("Comment not found");
      }
    }
    const comment = this.commentFactoryService.createComment(
      createCommentDto,
      req.user,
      postExist,
      commentExist
    );
    const createdComment = await this.commentRepository.create(comment);
    // createdComment.parentId =[]
    // createdComment.markModified("parentId")
    // await createdComment.save()
    return res.status(201).json({
      message: "Comment created successfully",
      success: true,
      data: { createdComment },
    });
  };
}
export default new CommentService();
