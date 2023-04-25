import {DeletedObject, InsertedObject, UpdatedObject} from "../models/additional-types/mongo-db-types";
import {client} from "../database/mongo-db";
import {CommentViewModel} from "../models/view-models/comments-view-model";
import {ObjectId} from "mongodb";
import {CommentsDbModel} from "../models/mongo-db-models/comments-db-model";

const commentsCollection = client.db('bloggers-platform').collection<CommentsDbModel>('comments')
export const commentsRepository =
    {
        async createComment (comment: CommentsDbModel): Promise<InsertedObject> {
                return await commentsCollection.insertOne(comment)
        },
        async updateComment (id: string, body: CommentViewModel): Promise<UpdatedObject> {
                return await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: body})
        },
        async deleteComment (id: string): Promise<DeletedObject> {
                return await commentsCollection.deleteOne({_id: new ObjectId(id)})
        }
    }