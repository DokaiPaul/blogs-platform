import {DeletedObject, InsertedObject, UpdatedObject} from "../models/additional-types/mongo-db-types";
import {client} from "../database/mongo-db";
import {CommentViewModel} from "../models/view-models/comments-view-model";
import {ObjectId} from "mongodb";

const commentsCollection = client.db('bloggers-platform').collection<CommentViewModel>('comments')
export const commentsRepository =
    {
        async createComment (comment: CommentViewModel): Promise<InsertedObject> {
                return await commentsCollection.insertOne(comment)
        },
        async updateComment (id: string, body: CommentViewModel): Promise<UpdatedObject> {
                return await commentsCollection.updateOne({_id: new ObjectId(id)}, body)
        },
        async deleteComment (id: string): Promise<DeletedObject> {
                return await commentsCollection.deleteOne({_id: new ObjectId(id)})
        }
    }