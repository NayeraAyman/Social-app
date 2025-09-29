import { CreatePostDto, UpdatePostDto } from "../post.dto";
import { Post } from "../entity";
import { IUser } from "../../../utils";

export class PostFactoryService {
    createPost(createpostDto:CreatePostDto,user:IUser){
     const post = new Post();
     post.userId = user._id;
     post.content = createpostDto.content;
     post.reactions = [];
     post.attachment= [];
     return post;
    }
    updatePost(updatePostDto:UpdatePostDto){
     
    }
  
}
