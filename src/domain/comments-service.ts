//todo fill the service layer by necessary params
import {changeKeyName} from "../utils/object-operations";
import {CommentViewModel} from "../models/view-models/comments-view-model";
import {commentsRepository} from "../repositories/comments-repository";

//todo add rest of the operations into the service object
export const commentsService =
    {
        async findComments () {

        },
        async findCommentById () {

        },
        async createComment (req: Request): Promise<CommentViewModel> {
                const newComment: CommentViewModel = {
                        content: req.body.content,
                        commentatorInfo: {
                                userId: req.headers.userId,
                                userLogin: req.headers.userLogin
                        },
                        createdAt: new Date().toISOString()
                }

                await commentsRepository.createComment(newComment)
                changeKeyName(newComment, '_id', 'id')

                return newComment;

        },
        async updateComment () {

        },
        async deleteComment (id: string): Promise<boolean> {
                const result = await commentsRepository.deleteComment(id)

                return result.deletedCount === 1
        }
    }