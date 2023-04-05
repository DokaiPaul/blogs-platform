import {BlogInputType, BlogsType} from "../types/blogs-types";
import {blogs_db} from "../database/blogs-db";
import {stat} from "fs";

export const blogsRepository = {
    async getAllBlogs (): Promise<BlogsType[]> {
        const blogs = blogs_db;
        return blogs;
    },
    async getBlogById (id: string): Promise<BlogsType | undefined> {
        const blog = blogs_db.find(b => b.id === id)
        return blog;
    },
    async createBlog (body: BlogInputType): Promise<BlogsType> {
        const newBlog = {
            id: Date.now().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        blogs_db.push(newBlog)
        return newBlog;
    },
    async updateBlog (blog: BlogsType , body:BlogInputType): Promise<void> {
        body.name ? blog.name = body.name : null
        body.description ? blog.description = body.description : null
        body.websiteUrl ? blog.websiteUrl = body.websiteUrl : null
    },
    async deleteBlog (id: string): Promise<boolean> {
        const index: number = blogs_db.findIndex(b => b.id === id)

        if(index === -1) {
            return false;
        }
        blogs_db.splice(index, 1);
        return true;
    }
}