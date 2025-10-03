import { NextFunction, Request, Response } from "express";
import { CreatePostDto } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB";
import { NotFoundException, REACTION } from "../../utils";

class PostService {
  private readonly postFactoryService = new PostFactoryService();
  private readonly postRepository = new PostRepository();
  constructor() {}
  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    //get data from req
    const createPostDto: CreatePostDto = req.body;
    //factory >> prepare Post data >> post entity >> repository
    const post = this.postFactoryService.createPost(createPostDto, req.user);
    //repository >> post entity >> DB
    const createdPost = await this.postRepository.create(post);
    //response
    res.status(201).json({
      message: "Post created successfully",
      data: { createdPost },
    });
  };
  public addReaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    //get data from req
    const { id } = req.params;
    const userId = req.user._id;
    const { reaction } = req.body;

    //check if post exists
    const postExist = await this.postRepository.exist({ _id: id });
    if (!postExist) {
      throw new NotFoundException("Post not found");
    }
    let userReactedIndex = postExist.reactions.findIndex((reaction) => {
      return reaction.userId.toString() == userId.toString();
    });
    if (userReactedIndex == -1) {
      await this.postRepository.update(
        { _id: id },
        {
          $push: {
            reactions: {
              userId,
              reaction,
            },
          },
        }
      );
    } else if ([undefined, null, ""].includes(reaction)) {
      await this.postRepository.update(
        { _id: id },
        { $pull: { reactions: postExist.reactions[userReactedIndex] } }
      );
    } else {
      await this.postRepository.update(
        { _id: id, "reactions.userId": userId },
        { "reactions.$.reaction": reaction }
      );
    }

    res.sendStatus(204);
  };
  public getSpecificPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const post = await this.postRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          { path: "userId", select: "fullName firstName lastName" },
          { path: "reactions.userId", select: "fullName firstName lastName" },
          { path: "comments", match: { parentId: [] } },
        ],
      }
    );
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    return res.status(200).json({
      message: "Post fetched successfully",
      data: { post },
    });
  };
}
export default new PostService();
