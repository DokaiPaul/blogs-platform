import mongoose from "mongoose";
import {PostSchema} from "../schemas/post-schema";
import {PostsDbModel} from "../../models/mongo-db-models/posts-db-model";

export const PostModel = mongoose.model<PostsDbModel>('posts', PostSchema)