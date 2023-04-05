import {InputPostType, PostsType} from "../types/posts-types";
import {blogs_db} from "../database/blogs-db";
import {posts_db} from "../database/posts-db";

export const postsRepository = {
    async getAllPosts (): Promise<PostsType[]> {
        return posts_db;
    },
    async getPostById (id: string): Promise<PostsType | undefined> {
        const post = posts_db.find(v => v.id === id)
        return post;
    },
    async createPost (body: PostsType): Promise<PostsType> {

        const newPost = {
            id: Date.now().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogs_db.find(b => b.id === body.blogId)?.name
        }

        // @ts-ignore
        posts_db.push(newPost)
        // @ts-ignore
        return newPost
    },
    async updatePost (post: PostsType, body: InputPostType): Promise<void> {
        body.title ? post.title = body.title : null
        body.shortDescription ? post.shortDescription = body.shortDescription : null
        body.content ? post.content = body.content : null
        body.blogId ? post.blogId = body.blogId : null
    },
    async deletePost (id: string): Promise<boolean> {
        const index: number = posts_db.findIndex(b => b.id === id);
        if(index === -1) {
            return false;
        }
        posts_db.splice(index, 1);
        return true;
    }
}