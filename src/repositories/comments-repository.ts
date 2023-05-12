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
        },
        //todo complete methods below
        async addLike(userId: string, commentId: string) {
            return CommentModel.updateOne(
                {_id: new ObjectId(commentId)},
                {$push: {likes: {
                                userId: userId,
                                date: new Date()
                        }}
                })
        },
        async addDislike(userId: string, commentId: string) {
            return CommentModel.updateOne(
                {_id: new ObjectId(commentId)},
                {$push: {dislikes: {
                                userId: userId,
                                date: new Date()
                        }}
                })
        },
        async removeLike(userId: string, commentId: string) {
            return CommentModel.updateOne(
                {_id: new ObjectId(commentId)},
                {$pull: {likes: {userId: userId}}
                })
        },
        async removeDislike(userId: string, commentId: string) {
            return CommentModel.updateOne(
                {_id: new ObjectId(commentId)},
                {$pull: {dislikes: {userId: userId}}
                })
        },
        async findLikeByUser(userId: string, commentId: string) {
                return CommentModel.findOne({_id: new Object(commentId), likes: {$elemMatch: {userId: userId}}})
        },
        async findDislikeByUser(userId: string, commentId: string) {
            return CommentModel.findOne({_id: new Object(commentId), dislikes: {$elemMatch: {userId: userId}}})
        }
    }