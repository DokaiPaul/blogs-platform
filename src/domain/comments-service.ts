//todo fill the service layer by necessary params
import {changeKeyName} from "../utils/object-operations";
import {CommentsDB, CommentViewModel} from "../models/view-models/comments-view-model";
import {commentsRepository} from "../repositories/comments-repository";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";

//todo add rest of the operations into the service object
export const commentsService =
    {
        async findComments () {

        },
        async findCommentById () {

        },
        async createComment (req: Request): Promise<CommentViewModel> {
                // @ts-ignore
                const user = await usersQueryRepository.findUserById(req.userId)
                const newComment: CommentsDB = {
                        // @ts-ignore
                        content: req.body!.content,
                        commentatorInfo: {
                                userId: user!.userId,
                                userLogin: user!.login
                        },
                        createdAt: new Date().toISOString(),
                        // @ts-ignore
                        postId: req.params.id
                }

                await commentsRepository.createComment(newComment)
                changeKeyName(newComment, '_id', 'id')
                // @ts-ignore
                delete newComment.postId
                return newComment;

        },
        async updateComment (req: Request): Promise<string>  {

            // @ts-ignore
            const commentsId = req.params.id
            // @ts-ignore
            const content = req.body.content

            const comment = await commentsQueryRepository.findCommentById(commentsId)
            if(!comment) return 'wrong id'
                // @ts-ignore
            if(comment.commentatorInfo.userId !== req.userId) return 'not owner'

            comment.content = content
            const result = await commentsRepository.updateComment(commentsId, comment)

            if(result.matchedCount === 1) return 'success'
            return 'not updated'
        },
        async deleteComment (req: Request): Promise<string> {
            // @ts-ignore
            const comment = await commentsQueryRepository.findCommentById(req.params.id)

            if(!comment) return 'wrong id'
            // @ts-ignore
            if(comment.commentatorInfo.userId !== req.userId) return 'not owner'
            // @ts-ignore
            const result = await commentsRepository.deleteComment(req.params.id)

            if(result.deletedCount === 1) return 'success'
            return 'not deleted'
        }
    }