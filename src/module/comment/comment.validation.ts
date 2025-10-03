import {z} from "zod";
import {CreateCommentDto} from "./comment.dto";

export const createCommentSchema = z.object<CreateCommentDto>({
    content:z.string().min(1).max(255) as unknown as string,
    attachment:z.string().optional() as unknown as string,
})

