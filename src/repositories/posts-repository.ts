import {InputPostType, PostsType} from "../types/posts-types";
import {blogs_db} from "../database/blogs-db";
import {posts_db} from "../database/posts-db";

export const postsRepository = {
    createRepository (body: PostsType) {

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
        return newPost
    },
    updateRepository(post: PostsType, body: InputPostType): void {
        body.title ? post.title = body.title : null
        body.shortDescription ? post.shortDescription = body.shortDescription : null
        body.content ? post.content = body.content : null
        body.blogId ? post.blogId = body.blogId : null
    }
}