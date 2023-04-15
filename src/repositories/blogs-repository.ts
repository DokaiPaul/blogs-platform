import {BlogInputType, BlogsType} from "../types/blogs-types";
import {client} from "../database/mongo-db";
import {ObjectId} from "mongodb";
import {DeletedObject, InsertedObject, UpdatedObject} from "../types/mongo-db-types";

const blogsCollection = client.db('bloggers-platform').collection<BlogsType>('blogs')
export const blogsRepository = {
    async findAllBlogs (): Promise<BlogsType[] | null | undefined> {

        return await blogsCollection.find({}).toArray();
    },
    async findBlogById (id: string): Promise<BlogsType | null | undefined> {

        return await blogsCollection.findOne({_id: new ObjectId(id)});
    },
    async createBlog (blog: BlogsType): Promise<InsertedObject> {

        return await blogsCollection.insertOne(blog)
    },
    async updateBlog (id: string , body:BlogInputType): Promise<UpdatedObject> {

        return await blogsCollection.updateOne({_id: new ObjectId(id)}, { $set: {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }});
    },
    async deleteBlog (id: string): Promise<DeletedObject> {

        return  await blogsCollection.deleteOne({_id: new ObjectId(id)})
    }
}