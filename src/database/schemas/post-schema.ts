import mongoose from "mongoose";
import {PostsDbModel} from "../../models/mongo-db-models/posts-db-model";

export const PostSchema = new mongoose.Schema<PostsDbModel>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    likes: {type: [], required: true},
    dislikes: {type: [], required: true}
})