import {BlogInputType, BlogsType} from "../types/blogs-types";
import {blogs_db} from "../database/blogs-db";
import {stat} from "fs";
import {client} from "../database/mongo-db";
import {PostsType} from "../types/posts-types";

export const blogsCollection = client.db('bloggers-platform').collection<BlogsType>('blogs')
export const blogsRepository = {
    async getAllBlogs (): Promise<BlogsType[]> {
        const blogs = blogsCollection.find({}, {projection: {_id: 0}}).toArray();
        return blogs;
    },
    async getBlogById (id: string): Promise<BlogsType | null> {
        const blog = blogsCollection.findOne({id: id}, {projection: {_id: 0}})
        return blog;
    },
    async createBlog (body: BlogInputType): Promise<BlogsType> {
        const newBlog = {
            id: Date.now().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        // @ts-ignore
        const result = await blogsCollection.insertOne(newBlog)
        // @ts-ignore
        const {_id, ...blog} = newBlog;
        return blog;
    },
    async updateBlog (id: string , body:BlogInputType): Promise<boolean> {
        const result = await blogsCollection.updateOne({id: id}, { $set: {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }});

        return result.matchedCount === 1;
    },
    async deleteBlog (id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})

        return result.deletedCount === 1
    }
}