import {Request} from "express";
import {changeKeyName} from "../utils/object-operations";
import {CommentViewModel} from "../models/view-models/comments-view-model";
import {commentsRepository} from "../repositories/comments-repository";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {CommentsDbModel} from "../models/mongo-db-models/comments-db-model";

export const commentsService =
    {
        async createComment (req: Request): Promise<CommentViewModel | null> {
                if(!req.userId) return null
                const user = await usersQueryRepository.findUserById(req.userId)
                const newComment: CommentsDbModel = {
                        content: req.body!.content,
                        commentatorInfo: {
                                userId: user!.userId,
                                userLogin: user!.login
                        },
                        createdAt: new Date().toISOString(),
                        postId: req.params.id
                }

                await commentsRepository.createComment(newComment)
                const output: CommentViewModel = {...newComment}
                changeKeyName(output, '_id', 'id')

                delete output.postId
                return output;

        },
        async updateComment (req: Request): Promise<string>  {

            const commentsId = req.params.id
            const content = req.body.content

            const comment = await commentsQueryRepository.findCommentById(commentsId)

            if(!comment) return 'wrong id'

            if(comment.commentatorInfo.userId !== req.userId) return 'not owner'

            comment.content = content
            const result = await commentsRepository.updateComment(commentsId, comment)

            if(result.matchedCount === 1) return 'success'

            return 'not updated'
        },
        async deleteComment (req: Request): Promise<string> {
            const comment = await commentsQueryRepository.findCommentById(req.params.id)

            if(!comment) return 'wrong id'

            if(comment.commentatorInfo.userId !== req.userId) return 'not owner'

            const result = await commentsRepository.deleteComment(req.params.id)

            if(result.deletedCount === 1) return 'success'

            return 'not deleted'
        }
    }