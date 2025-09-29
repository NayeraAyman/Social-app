import { NextFunction, Request, Response } from "express";
import { CreatePostDto } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB";
import { NotFoundException } from "../../utils";

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
        { $push: { reactions: { userId, reaction } } }
      );
    } else {
      await this.postRepository.update(
        { _id: id, "reactions.userId": userId },
        { "reactions.$.reaction": reaction }
      );
    }

    res.sendStatus(204);
  };
}
export default new PostService();
