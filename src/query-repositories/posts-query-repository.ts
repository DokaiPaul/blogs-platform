import {RequestWithParamsAndQuery, RequestWithQuery} from "../types/request-types";
import {parsePostsQuery} from "./utils/process-query-params";
import {client} from "../database/mongo-db";
import {PostsType} from "../types/posts-types";
import {QueryPostsModel} from "../models/query-models/query-posts-model";
import {changeKeyName} from "../utils/object-operations";

const postCollection = client.db('bloggers-platform').collection<PostsType>('posts')
export const postsQueryRepository = {
    async findPosts (req: RequestWithQuery<QueryPostsModel>): Promise<PostsType[] | null | undefined> {
        const [sortBy, sortDir, pageNum, pageSize] = parsePostsQuery(req.query);

        let posts: PostsType[] | null;
        let filter = {};
        let sort = {[sortBy]: sortDir}


        posts = await postCollection.find(filter)
            // @ts-ignore
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .toArray();

        posts.forEach(p => changeKeyName(p, '_id','id'))

        const totalMatchedPosts = await postCollection.find(filter).count()
        const totalPages = Math.ceil(totalMatchedPosts / pageSize)

        const paginator = {
            pagesCount: totalPages,
            page: pageNum,
            pageSize: pageSize,
            totalCount: totalMatchedPosts,
            items: posts
        }
        // @ts-ignore
        return paginator;
    },
    async findPostsInBlog (req: RequestWithParamsAndQuery<{id: string}, QueryPostsModel>): Promise<PostsType[] | null | undefined>{
        const [sortBy, sortDir, pageNum, pageSize] = parsePostsQuery(req.query);

        let posts: PostsType[] | null;
        let sort = {[sortBy]: sortDir}


        posts = await postCollection.find({blogId: req.params.id})
            // @ts-ignore
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .toArray();

        if(posts.length < 1) return null;
        posts.forEach(p => changeKeyName(p, '_id','id'))

        const totalMatchedPosts = await postCollection.find({blogId: req.params.id}).count()
        const totalPages = Math.ceil(totalMatchedPosts / pageSize)

        const paginator = {
            pagesCount: totalPages,
            page: pageNum,
            pageSize: pageSize,
            totalCount: totalMatchedPosts,
            items: posts
        }
        // @ts-ignore
        return paginator;
    }
}