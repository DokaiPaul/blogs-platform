import {BlogInputType, BlogsType} from "../types/blogs-types";
import {blogs_db} from "../database/blogs-db";
import {stat} from "fs";

export const blogsRepository = {
    getAllRepositories(): BlogsType[] {
        const blogs = blogs_db;
        return blogs;
    },
    getRepositoryById(id: string): BlogsType | undefined {
        const blog = blogs_db.find(b => b.id === id)
        return blog;
    },
    createRepository (body: BlogInputType): BlogsType {
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
    },
    deleteRepository(id: string): number {
        const index: number = blogs_db.findIndex(b => b.id === id)
        let status: number;
        if(index === -1) {
            status = 404;
            return status;
        }
        status = 204;
        blogs_db.splice(index, 1);
        return status;
    }
}