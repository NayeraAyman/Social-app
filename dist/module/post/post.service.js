"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
class PostService {
    postFactoryService = new factory_1.PostFactoryService();
    postRepository = new DB_1.PostRepository();
    constructor() { }
    createPost = async (req, res, next) => {
        //get data from req
        const createPostDto = req.body;
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
    addReaction = async (req, res, next) => {
        //get data from req
        const { id } = req.params;
        const userId = req.user._id;
        const { reaction } = req.body;
        //check if post exists
        const postExist = await this.postRepository.exist({ _id: id });
        if (!postExist) {
            throw new utils_1.NotFoundException("Post not found");
        }
        let userReactedIndex = postExist.reactions.findIndex((reaction) => {
            return reaction.userId.toString() == userId.toString();
        });
        if (userReactedIndex == -1) {
            await this.postRepository.update({ _id: id }, { $push: { reactions: { userId, reaction } } });
        }
        else {
            await this.postRepository.update({ _id: id, "reactions.userId": userId }, { "reactions.$.reaction": reaction });
        }
        res.sendStatus(204);
    };
}
exports.default = new PostService();
