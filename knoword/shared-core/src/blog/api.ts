import axios from "axios";
import { BlogPost, BlogPostPayload } from "./types";
import { getBackendUrl } from "../config";

const BASE_URL = getBackendUrl();

export async function createBlogPost(payload: BlogPostPayload): Promise<BlogPost> {
  const response = await axios.post(`${BASE_URL}/posts`, payload);
  return response.data;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await axios.get(`${BASE_URL}/posts`);
  return response.data;
}