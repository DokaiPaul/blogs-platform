import {BlogInputType, BlogsType} from "../types/blogs-types";
import {client} from "../database/mongo-db";
import {changeKeyName} from "../utils/object-operations";
import {ObjectId} from "mongodb";

const blogsCollection = client.db('bloggers-platform').collection<BlogsType>('blogs')
export const blogsRepository = {
    async getAllBlogs (): Promise<BlogsType[] | undefined> {

        const blogs = await blogsCollection.find({}).toArray();
        blogs.forEach(b => changeKeyName(b, '_id','id'));

        return blogs;
    },
    async getBlogById (id: string): Promise<BlogsType | null> {

        // @ts-ignore
        const blog = await blogsCollection.findOne({_id: ObjectId(id)})
        if(!blog) {
            return null;
        }
        changeKeyName(blog, '_id', 'id')

        return blog;
    },
    async createBlog (body: BlogInputType): Promise<BlogsType> {

        const newBlog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog)
        changeKeyName(newBlog, '_id', 'id')

        return newBlog;
    },
    async updateBlog (id: string , body:BlogInputType): Promise<boolean> {

        // @ts-ignore
        const result = await blogsCollection.updateOne({_id: ObjectId(id)}, { $set: {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }});

        return result.matchedCount === 1;
    },
    async deleteBlog (id: string): Promise<boolean> {

        // @ts-ignore
        const result = await blogsCollection.deleteOne({_id: ObjectId(id)})

        return result.deletedCount === 1
    }
}