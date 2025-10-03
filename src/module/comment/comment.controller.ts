import { Router } from "express";
import { isAuthenticated } from "../../middleware";
import commentService from "./comment.service";
import { isValid } from "../../middleware";
import { createCommentSchema } from "./comment.validation";
const router = Router({mergeParams:true});

router.post("{/:id}",isAuthenticated(),isValid(createCommentSchema),commentService.createComment)

export default router;
