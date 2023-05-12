import mongoose from "mongoose";
import {CommentsDbModel} from "../../models/mongo-db-models/comments-db-model";

export const CommentSchema = new mongoose.Schema<CommentsDbModel>({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    likes: {type: [], required: true},
    dislikes: {type: [], required: true},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true}
})