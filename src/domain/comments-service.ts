import {Request} from "express";
import {changeKeyName} from "../utils/object-operations";
import {CommentViewModel, LikeStatus} from "../models/view-models/comments-view-model";
import {commentsRepository} from "../repositories/comments-repository";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {CommentsDbModel} from "../models/mongo-db-models/comments-db-model";
import {ChangeStatusTransferModel} from "../models/additional-types/data-transfer-object";
import {ObjectId} from "mongodb";

export const commentsService =
    {
        async createComment (req: Request): Promise<CommentViewModel | null> {
                if(!req.userId) return null
                const user = await usersQueryRepository.findUserById(req.userId)
                const newComment: CommentsDbModel = {
                        _id: new ObjectId(),
                        content: req.body!.content,
                        commentatorInfo: {
                                userId: user!.userId,
                                userLogin: user!.login
                        },
                        likes: [],
                        dislikes: [],
                        createdAt: new Date().toISOString(),
                        postId: req.params.id
                }

                await commentsRepository.createComment(newComment)
                const output: CommentViewModel = {
                    ...newComment,
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: LikeStatus.None
                    }
                }
                delete output.likes
                delete output.dislikes
                changeKeyName(output, '_id', 'id')

                delete output.postId
                return output;

        },
        async updateComment (req: Request): Promise<string>  {

            const commentsId = req.params.id
            const content = req.body.content
            const userId = req.userId ?? null

            const comment = await commentsQueryRepository.findCommentById(commentsId, userId)

            if(!comment) return 'wrong id'

            if(comment.commentatorInfo.userId !== req.userId) return 'not owner'

            comment.content = content
            const result = await commentsRepository.updateComment(commentsId, comment)

            if(result.matchedCount === 1) return 'success'

            return 'not updated'
        },
        async deleteComment (req: Request): Promise<string> {
            const comment = await commentsQueryRepository.findCommentById(req.params.id, null)

            if(!comment) return 'wrong id'

            if(comment.commentatorInfo.userId !== req.userId) return 'not owner'

            const result = await commentsRepository.deleteComment(req.params.id)

            if(result.deletedCount === 1) return 'success'

            return 'not deleted'
        },
        async setLikeDislikeStatus (statusData: ChangeStatusTransferModel): Promise<boolean | null> {
            const {status, commentId, userId} = statusData
            //todo complete this function
            let currentStatus = 'None'
            const isAlreadyLiked = await commentsRepository.findLikeByUser(userId, commentId)
            if(isAlreadyLiked) currentStatus = 'Like'

            const isAlreadyDisliked = await commentsRepository.findDislikeByUser(userId, commentId)
            if(isAlreadyDisliked) currentStatus = 'Dislike'

            if(currentStatus === status) return false

            if(currentStatus === 'None') {
                const result = await this.addNewStatus(statusData)
                return result
            }

            const result = await this.changeCurrentStatus(statusData)
            return result
        },
        async addNewStatus ({status, userId, commentId}: ChangeStatusTransferModel): Promise<boolean | null> {
            if(status === 'Like') {
                const result = await commentsRepository.addLike(userId, commentId)
                if(!result) return false
                return true
            }
            if(status === 'Dislike') {
                const result = await commentsRepository.addDislike(userId, commentId)
                if(!result) return false
                return true
            }
            return null
        },
        async changeCurrentStatus ({status, userId, commentId}: ChangeStatusTransferModel): Promise<boolean | null> {
            if(status === 'Like') {
                const result = await  commentsRepository.addLike(userId, commentId)
                if(!result) return false

                const isRemoved = await commentsRepository.removeDislike(userId, commentId)
                if(!isRemoved) return false

                return true
            }
            if(status === 'Dislike') {
                const result = await  commentsRepository.addDislike(userId, commentId)
                if(!result) return false

                const isRemoved = await commentsRepository.removeLike(userId, commentId)
                if(!isRemoved) return false

                return true
            }
            //if status is None than execute code below
            const isLiked = await commentsRepository.findLikeByUser(userId, commentId)
            if(isLiked) {
                const result = await commentsRepository.removeLike(userId, commentId)
                if(!result) return false
                return true
            }

            const isDisliked = await commentsRepository.findDislikeByUser(userId, commentId)
            if(isDisliked) {
                const result = await commentsRepository.removeDislike(userId, commentId)
                if(!result) return false
                return true
            }
            return null
        }
    }