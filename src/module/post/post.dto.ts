export interface CreatePostDto {
    content:string;
    attachment?:any[];
}

export interface UpdatePostDto {
    content?:string;
    attachment?:any[];
}
