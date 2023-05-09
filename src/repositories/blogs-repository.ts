import {BlogInputType} from "../models/input-models/blogs-input-model";
import {ObjectId} from "mongodb";
import {DeletedObject} from "../models/additional-types/mongo-db-types";
import {BlogsType} from "../models/view-models/blogs-view-model";
import {BlogModel} from "../database/models/blog-model";

export const blogsRepository = {
    async findAllBlogs (): Promise<BlogsType[] | null | undefined> {

        return BlogModel.find({});
    },
    async findBlogById (id: string): Promise<BlogsType | null | undefined> {

        return BlogModel.findOne({_id: new ObjectId(id)});
    },
    //todo add type for output
    async createBlog (blog: BlogsType) {

        return BlogModel.create(blog)
    },
    //todo add type for output
    async updateBlog (id: string , body:BlogInputType) {

        return BlogModel.updateOne({_id: new ObjectId(id)}, {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        });
    },
    async deleteBlog (id: string): Promise<DeletedObject> {

        return BlogModel.deleteOne({_id: new ObjectId(id)})
    }
}