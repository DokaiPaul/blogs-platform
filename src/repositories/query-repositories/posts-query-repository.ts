import {RequestWithParamsAndQuery, RequestWithQuery} from "../../models/request-types";
import {parsePostsQuery} from "./utils/process-query-params";
import {QueryPostsModel} from "../../models/query-models/query-posts-model";
import {changeKeyName} from "../../utils/object-operations";
import {PostsType} from "../../models/view-models/posts-view-model";
import {Paginator} from "../../models/view-models/paginator-view-model";
import {SortOrder} from "mongoose";
import {PostModel} from "../../database/models/post-model";

export const postsQueryRepository = {
    async findPosts (req: RequestWithQuery<QueryPostsModel>): Promise<Paginator<PostsType[]> | null | undefined> {
        const {sortBy, sortDir, pageNum, pageSize} = parsePostsQuery(req.query);

        let posts: PostsType[] | null;
        let filter = {};
        let sort = {[sortBy]: sortDir as SortOrder}

        posts = await PostModel.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .select('-__v')
            .lean()

        if(!posts) posts = []

        posts.forEach(p => changeKeyName(p, '_id','id'))

        const totalMatchedPosts = await PostModel.countDocuments(filter)
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
        const {sortBy, sortDir, pageNum, pageSize}= parsePostsQuery(req.query);

        let posts: PostsType[] | null;
        let sort = {[sortBy]: sortDir as SortOrder}
        const filter = {blogId: req.params.id}

        posts = await PostModel.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .select('-__v')
            .lean()

        if(!posts || posts.length < 1) return null;

        posts.forEach(p => changeKeyName(p, '_id','id'))

        const totalMatchedPosts = await PostModel.countDocuments(filter)
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