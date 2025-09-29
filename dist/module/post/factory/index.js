"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostFactoryService = void 0;
const entity_1 = require("../entity");
class PostFactoryService {
    createPost(createpostDto, user) {
        const post = new entity_1.Post();
        post.userId = user._id;
        post.content = createpostDto.content;
        post.reactions = [];
        post.attachment = [];
        return post;
    }
    updatePost(updatePostDto) {
    }
}
exports.PostFactoryService = PostFactoryService;
