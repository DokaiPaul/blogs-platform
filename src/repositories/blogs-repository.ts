import {BlogInputType} from "../models/input-models/blogs-input-model";
import {client} from "../database/mongo-db";
import {ObjectId} from "mongodb";
import {DeletedObject, InsertedObject, UpdatedObject} from "../models/additional-types/mongo-db-types";
import {BlogsType} from "../models/view-models/blogs-view-model";
import {BlogsDbModel} from "../models/mongo-db-models/blogs-db-model";

const blogsCollection = client.db('bloggers-platform').collection<BlogsDbModel>('blogs')
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

        return await blogsCollection.deleteOne({_id: new ObjectId(id)})
    }
}