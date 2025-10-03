import { Router } from "express";
import { isAuthenticated } from "../../middleware";
import postService from "./post.service";
import { commentRouter } from "..";
import * as postValidation from "./post.validation";
import { isValid } from "../../middleware";
const router = Router();
router.use("/:postId/comment", commentRouter);
router.post(
  "/",
  isAuthenticated(),
  isValid(postValidation.createPostSchema),
  postService.createPost
);
router.patch(
  "/:id",
  isAuthenticated(),
  isValid(postValidation.addReactionSchema),
  postService.addReaction
);
router.get(
  "/:id",
  isValid(postValidation.getSpecificPostSchema),
  postService.getSpecificPost
);
export default router;
