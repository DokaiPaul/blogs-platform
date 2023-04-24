import {Paginator} from "../../models/view-models/paginator-view-model";
import {CommentsDB, CommentViewModel} from "../../models/view-models/comments-view-model";
import {client} from "../../database/mongo-db";
import {parsePostsQuery} from "./utils/process-query-params";
import {ObjectId, Sort} from "mongodb";
import {changeKeyName} from "../../utils/object-operations";

const commentsCollection = client.db('bloggers-platform').collection<CommentsDB>('comments')
export const commentsQueryRepository =
    {
        async findCommentsInPost (req: Request): Promise<Paginator<CommentViewModel[]>> {
            // @ts-ignore
            const [sortBy, sortDir, pageNum, pageSize] = parsePostsQuery(req.query);

            let comments: CommentsDB[] | null;
            let sort = {[sortBy]: sortDir} as Sort
// @ts-ignore
            comments = await commentsCollection.find({postId: req.params.id})
                .sort(sort)
                .limit(pageSize)
                .skip((pageNum - 1) * pageSize)
                .toArray()

            if(comments) comments.forEach(v => {
                // @ts-ignore
                delete v.postId
                changeKeyName(v, '_id', 'id')
            })

            const totalMatchedPosts = await commentsCollection.find({postId: req.params.id}).count()
            const totalPages = Math.ceil(totalMatchedPosts / pageSize)

            // @ts-ignore
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
            delete comment.postId
            changeKeyName(comment, '_id', 'id')

            return comment
        }
    }