import mongoose from "mongoose";
import {BlogsDbModel} from "../../models/mongo-db-models/blogs-db-model";
import {BlogSchema} from "../schemas/blog-schema";

export const BlogModel = mongoose.model<BlogsDbModel>('blogs', BlogSchema)