import {Paginator} from "../../models/view-models/paginator-view-model";
import {CommentViewModel, LikeStatus} from "../../models/view-models/comments-view-model";
import {parsePostsQuery} from "./utils/process-query-params";
import {ObjectId} from "mongodb";
import {changeKeyName} from "../../utils/object-operations";
import {RequestWithParamsAndQuery} from "../../models/request-types";
import {QueryCommentsModel} from "../../models/query-models/query-comments-model";
import {CommentModel} from "../../database/models/comment-model";
import {SortOrder} from "mongoose";
import {CommentsDbModel} from "../../models/mongo-db-models/comments-db-model";

export const commentsQueryRepository =
    {
        async findCommentsInPost (req: RequestWithParamsAndQuery<{id: string}, QueryCommentsModel>): Promise<Paginator<CommentViewModel[]>> {
            const {sortBy, sortDir, pageNum, pageSize} = parsePostsQuery(req.query);
            let comments: CommentsDbModel[] | null;
            let output: CommentViewModel[]
            let sort = {[sortBy]: sortDir as SortOrder}
            let filter = {postId: req.params.id}
            let userId = req.userId ?? null

            comments = await CommentModel.find(filter)
                .sort(sort)
                .limit(pageSize)
                .skip((pageNum - 1) * pageSize)
                .select('-__v')
                .lean()

            if (comments) {
                comments.forEach(v => {

                    delete v.postId
                    changeKeyName(v, '_id', 'id')
                })

                output = [...comments] as CommentViewModel[]
                output.map(c => {
                    let myStatus: LikeStatus;

                    if(userId) {
                        const isLiked = c.likes?.find(u => u.userId === userId)
                        const isDisliked = c.dislikes?.find(u => u.userId === userId)

                        myStatus = LikeStatus.None
                        if(isDisliked) myStatus = LikeStatus.Dislike
                        if(isLiked) myStatus = LikeStatus.Like
                    } else {
                        myStatus = LikeStatus.None
                    }

                    c.likesInfo = {
                        likesCount: c.likes?.length ?? 0,
                        dislikesCount: c.dislikes?.length ?? 0,
                        myStatus: myStatus
                        }
                    delete c.likes
                    delete c.dislikes
                })
            } else {
                output = []
            }

            const totalMatchedPosts = await CommentModel.countDocuments(filter)
            const totalPages = Math.ceil(totalMatchedPosts / pageSize)

            return {
                pagesCount: totalPages,
                page: pageNum,
                pageSize: pageSize,
                totalCount: totalMatchedPosts,
                items: output
            }
        },
        async findCommentById (id: string, userId: string | null) {
            let myStatus: LikeStatus = LikeStatus.None
            const comment = await CommentModel.findOne({_id: new ObjectId(id)}).select('-__v').lean()

            if(!comment) return null

            if(userId) {
                const isLiked = comment.likes.find(v => v.userId === userId)
                const isDisliked = comment.dislikes.find(v => v.userId === userId)

                if(isDisliked) myStatus = LikeStatus.Dislike
                if(isLiked) myStatus = LikeStatus.Like
            }

            const output: CommentViewModel = {
                ...comment,
                likesInfo: {
                    likesCount: comment.likes?.length ?? 0,
                    dislikesCount: comment.dislikes?.length ?? 0,
                    myStatus: myStatus
                }
            }

            delete output.postId
            delete output.likes
            delete output.dislikes

            changeKeyName(output, '_id', 'id')

            return output
        }
    }