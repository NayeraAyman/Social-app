"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
class CommentService {
    postRepository = new DB_1.PostRepository();
    commentRepository = new DB_1.CommentRepository();
    commentFactoryService = new factory_1.CommenFactoryService();
    constructor() { }
    createComment = async (req, res, next) => {
        const { postId, id } = req.params;
        const createCommentDto = req.body;
        const postExist = await this.postRepository.exist({ _id: postId });
        if (!postExist) {
            throw new utils_1.NotFoundException("Post not found");
        }
        let commentExist = undefined;
        if (id) {
            commentExist = await this.commentRepository.exist({ _id: id });
            if (!commentExist) {
                throw new utils_1.NotFoundException("Comment not found");
            }
        }
        const comment = this.commentFactoryService.createComment(createCommentDto, req.user, postExist, commentExist);
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
exports.default = new CommentService();
