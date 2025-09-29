import {Router} from "express";
import { isAuthenticated } from "../../middleware";
import postService from "./post.service";
const router = Router();

router.post("/",isAuthenticated(),postService.createPost)
router.patch("/:id",isAuthenticated(),postService.addReaction)
export default router;