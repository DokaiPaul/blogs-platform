import {Paginator} from "../../models/view-models/paginator-view-model";
import {CommentViewModel} from "../../models/view-models/comments-view-model";
import {client} from "../../database/mongo-db";
import {parsePostsQuery} from "./utils/process-query-params";
import {ObjectId, Sort} from "mongodb";
import {changeKeyName} from "../../utils/object-operations";
import {RequestWithParamsAndQuery} from "../../models/request-types";
import {QueryCommentsModel} from "../../models/query-models/query-comments-model";
import {CommentsDbModel} from "../../models/mongo-db-models/comments-db-model";

const commentsCollection = client.db('bloggers-platform').collection<CommentsDbModel>('comments')
export const commentsQueryRepository =
    {
        async findCommentsInPost (req: RequestWithParamsAndQuery<{id: string}, QueryCommentsModel>): Promise<Paginator<CommentViewModel[]>> {
            const [sortBy, sortDir, pageNum, pageSize] = parsePostsQuery(req.query);

            let comments: CommentViewModel[] | null;
            let sort = {[sortBy]: sortDir} as Sort
            let filter = {postId: req.params.id}

            comments = await commentsCollection.find(filter)
                .sort(sort)
                .limit(pageSize)
                .skip((pageNum - 1) * pageSize)
                .toArray()

            if(comments) comments.forEach(v => {

                delete v.postId
                changeKeyName(v, '_id', 'id')
            })

            const totalMatchedPosts = await commentsCollection.countDocuments(filter)
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
            const comment = await commentsCollection.findOne({_id: new ObjectId(id)})
            if(!comment) return null

            const output: CommentViewModel = {...comment}
            delete output.postId

            changeKeyName(comment, '_id', 'id')

            return comment
        }
    }