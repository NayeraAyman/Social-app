"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const abstarct_repository_1 = require("../../abstarct.repository");
const comment_model_1 = require("./comment.model");
class CommentRepository extends abstarct_repository_1.AbstractRepository {
    constructor() {
        super(comment_model_1.commentModel);
    }
}
exports.CommentRepository = CommentRepository;
