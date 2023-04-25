import {RequestWithParamsAndQuery, RequestWithQuery} from "../../models/request-types";
import {parsePostsQuery} from "./utils/process-query-params";
import {client} from "../../database/mongo-db";
import {QueryPostsModel} from "../../models/query-models/query-posts-model";
import {changeKeyName} from "../../utils/object-operations";
import {PostsType} from "../../models/view-models/posts-view-model";
import {Paginator} from "../../models/view-models/paginator-view-model";
import {Sort} from "mongodb";
import {PostsDbModel} from "../../models/mongo-db-models/posts-db-model";

const postCollection = client.db('bloggers-platform').collection<PostsDbModel>('posts')
export const postsQueryRepository = {
    async findPosts (req: RequestWithQuery<QueryPostsModel>): Promise<Paginator<PostsType[]> | null | undefined> {
        const [sortBy, sortDir, pageNum, pageSize] = parsePostsQuery(req.query);

        let posts: PostsType[] | null;
        let filter = {};
        let sort = {[sortBy]: sortDir} as Sort


        posts = await postCollection.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .toArray();

        posts.forEach(p => changeKeyName(p, '_id','id'))

        const totalMatchedPosts = await postCollection.countDocuments(filter)
        const totalPages = Math.ceil(totalMatchedPosts / pageSize)

        return {
            pagesCount: totalPages,
            page: pageNum,
            pageSize: pageSize,
            totalCount: totalMatchedPosts,
            items: posts
        };
    },
    async findPostsInBlog (req: RequestWithParamsAndQuery<{id: string}, QueryPostsModel>): Promise<Paginator<PostsType[]> | null | undefined>{
        const [sortBy, sortDir, pageNum, pageSize] = parsePostsQuery(req.query);

        let posts: PostsType[] | null;
        let sort = {[sortBy]: sortDir} as Sort
        const filter = {blogId: req.params.id}

        posts = await postCollection.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .toArray();

        if(posts.length < 1) return null;

        posts.forEach(p => changeKeyName(p, '_id','id'))

        const totalMatchedPosts = await postCollection.countDocuments(filter)
        const totalPages = Math.ceil(totalMatchedPosts / pageSize)

        return {
            pagesCount: totalPages,
            page: pageNum,
            pageSize: pageSize,
            totalCount: totalMatchedPosts,
            items: posts
        };
    }
}