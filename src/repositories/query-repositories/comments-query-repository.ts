import {Paginator} from "../../models/view-models/paginator-view-model";
import {CommentViewModel} from "../../models/view-models/comments-view-model";
import {parsePostsQuery} from "./utils/process-query-params";
import {ObjectId} from "mongodb";
import {changeKeyName} from "../../utils/object-operations";
import {RequestWithParamsAndQuery} from "../../models/request-types";
import {QueryCommentsModel} from "../../models/query-models/query-comments-model";
import {CommentModel} from "../../database/models/comment-model";
import {SortOrder} from "mongoose";

export const commentsQueryRepository =
    {
        async findCommentsInPost (req: RequestWithParamsAndQuery<{id: string}, QueryCommentsModel>): Promise<Paginator<CommentViewModel[]>> {
            const {sortBy, sortDir, pageNum, pageSize} = parsePostsQuery(req.query);

            let comments: CommentViewModel[] | null;
            let sort = {[sortBy]: sortDir as SortOrder}
            let filter = {postId: req.params.id}

            comments = await CommentModel.find(filter)
                .sort(sort)
                .limit(pageSize)
                .skip((pageNum - 1) * pageSize)
                .lean()

            if(!comments) comments = []

            if(comments) comments.forEach(v => {

                delete v.postId
                changeKeyName(v, '_id', 'id')
            })

            const totalMatchedPosts = await CommentModel.countDocuments(filter)
            const totalPages = Math.ceil(totalMatchedPosts / pageSize)

            return {
                pagesCount: totalPages,
                page: pageNum,
                pageSize: pageSize,
                totalCount: totalMatchedPosts,
                items: comments
            }
        },
        async findCommentById (id: string) {
            const comment = await CommentModel.findOne({_id: new ObjectId(id)}).lean()
            if(!comment) return null

            const output: CommentViewModel = {...comment}
            delete output.postId

            changeKeyName(output, '_id', 'id')

            return output
        }
    }