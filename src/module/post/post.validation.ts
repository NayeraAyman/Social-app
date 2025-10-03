import {z} from "zod";
import {AddReactionDto, CreatePostDto, getSpecificPostDto, UpdatePostDto} from "./post.dto";
import { REACTION } from "../../utils";

export const createPostSchema = z.object<CreatePostDto>({
    content:z.string().min(1).max(255) as unknown as string,
    attachment:z.array(z.string()).optional() as unknown as any[],
})

export const addReactionSchema = z.object<AddReactionDto>({
    reaction:z.enum(REACTION).optional() as unknown as string,
})

export const getSpecificPostSchema = z.object<getSpecificPostDto>({
    postId:z.string() as unknown as string,
})
