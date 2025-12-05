import { Post } from '@nestjs/common';
interface Post {
    id: number;
    title: string;
    content: string;
}
export declare class PostsController {
    private posts;
    getPosts(): Post[];
    createPost(body: {
        title: string;
        content: string;
    }): Post;
}
export {};
