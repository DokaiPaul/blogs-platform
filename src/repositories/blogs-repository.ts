import {BlogInputType, BlogsType} from "../types/blogs-types";
import {blogs_db} from "../database/blogs-db";

export const blogsRepository = {
    createRepository (body: BlogInputType) {
        const newBlog = {
            id: Date.now().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        blogs_db.push(newBlog)
        return newBlog;
    },
    updateRepository (blog: BlogsType ,body:BlogInputType): void {
        body.name ? blog.name = body.name : null
        body.description ? blog.description = body.description : null
        body.websiteUrl ? blog.websiteUrl = body.websiteUrl : null
    }

}