import mongoose from "mongoose";
import {BlogsDbModel} from "../../models/mongo-db-models/blogs-db-model";

export const BlogSchema = new mongoose.Schema<BlogsDbModel>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
})