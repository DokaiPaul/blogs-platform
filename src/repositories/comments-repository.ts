import {DeletedObject} from "../models/additional-types/mongo-db-types";
import {CommentViewModel} from "../models/view-models/comments-view-model";
import {ObjectId} from "mongodb";
import {CommentsDbModel} from "../models/mongo-db-models/comments-db-model";
import {CommentModel} from "../database/models/comment-model";

export const commentsRepository =
    {
            //todo add type for output
        async createComment (comment: CommentsDbModel) {
                return await CommentModel.create(comment)
        },
            //todo add type for output
        async updateComment (id: string, body: CommentViewModel) {
                return CommentModel.updateOne({_id: new ObjectId(id)}, {body})
        },
        async deleteComment (id: string): Promise<DeletedObject> {
                return CommentModel.deleteOne({_id: new ObjectId(id)})
        }
    }