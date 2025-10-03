import { REACTION } from "../../utils";

export interface CreatePostDto {
    content:string;
    attachment?:any[];
}

export interface AddReactionDto{
    reaction:string;
}

export interface getSpecificPostDto{
    postId:string;
}

export interface UpdatePostDto {
    content?:string;
    attachment?:any[];
}
