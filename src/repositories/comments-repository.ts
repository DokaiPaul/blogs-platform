import {DeletedObject, InsertedObject, UpdatedObject} from "../models/additional-types/mongo-db-types";
import {client} from "../database/mongo-db";
import {CommentsDB, CommentViewModel} from "../models/view-models/comments-view-model";
import {ObjectId} from "mongodb";

const commentsCollection = client.db('bloggers-platform').collection<CommentsDB>('comments')
export const commentsRepository =
    {
        async createComment (comment: CommentsDB): Promise<InsertedObject> {
                return await commentsCollection.insertOne(comment)
        },
        async updateComment (id: string, body: CommentViewModel): Promise<UpdatedObject> {
                return await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: body})
        },
        async deleteComment (id: string): Promise<DeletedObject> {
                return await commentsCollection.deleteOne({_id: new ObjectId(id)})
        }
    }