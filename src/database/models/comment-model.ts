import mongoose from "mongoose";
import {CommentSchema} from "../schemas/comment-schema";
import {CommentsDbModel} from "../../models/mongo-db-models/comments-db-model";

export const CommentModel = mongoose.model<CommentsDbModel>('comments', CommentSchema)