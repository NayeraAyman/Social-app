"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommenFactoryService = void 0;
const entity_1 = require("../entity");
class CommenFactoryService {
    createComment(createCommentDto, user, post, comment) {
        const newComment = new entity_1.Comment();
        newComment.userId = user._id;
        newComment.postId = post._id;
        newComment.parentId = comment ? [...comment.parentId, comment._id] : [];
        newComment.content = createCommentDto.content;
        newComment.reactions = [];
        return newComment;
    }
}
exports.CommenFactoryService = CommenFactoryService;
