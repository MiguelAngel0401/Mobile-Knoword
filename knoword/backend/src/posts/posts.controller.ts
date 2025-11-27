import { Controller, Get, Post, Body } from '@nestjs/common';

// 👇 Definimos la interfaz Post para tipar bien los datos
interface Post {
  id: number;
  title: string;
  content: string;
}

@Controller('posts')
export class PostsController {
  // 👇 Aquí tipamos el arreglo como Post[]
  private posts: Post[] = [];

  @Get()
  getPosts() {
    return this.posts;
  }

  @Post()
  createPost(@Body() body: { title: string; content: string }) {
    const newPost: Post = { id: Date.now(), ...body };
    this.posts.push(newPost); // ✅ ya no da error
    return newPost;
  }
}