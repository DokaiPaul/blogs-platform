import {InputPostType, PostsType} from "../types/posts-types";
import {blogs_db} from "../database/blogs-db";
import {posts_db} from "../database/posts-db";

export const postsRepository = {
    getAllRepositories (): PostsType[] {
        return posts_db;
    },
    getRepositoryByID (id: string): PostsType | undefined {
        const post = posts_db.find(v => v.id === id)
        return post;
    },
    createRepository (body: PostsType): PostsType {

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
    updateRepository (post: PostsType, body: InputPostType): void {
        body.title ? post.title = body.title : null
        body.shortDescription ? post.shortDescription = body.shortDescription : null
        body.content ? post.content = body.content : null
        body.blogId ? post.blogId = body.blogId : null
    },
    deleteRepository (id: string): number {
        const index: number = posts_db.findIndex(b => b.id === id);
        let status: number;
        if(index === -1) {
            status = 404;
            return status;
        }
        status = 204;
        posts_db.splice(index, 1);
        return status;
    }
}