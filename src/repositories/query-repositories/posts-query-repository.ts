import {RequestWithParamsAndQuery, RequestWithQuery} from "../../models/request-types";
import {parsePostsQuery} from "./utils/process-query-params";
import {QueryPostsModel} from "../../models/query-models/query-posts-model";
import {changeKeyName} from "../../utils/object-operations";
import {PostsType} from "../../models/view-models/posts-view-model";
import {Paginator} from "../../models/view-models/paginator-view-model";
import {SortOrder} from "mongoose";
import {PostModel} from "../../database/models/post-model";
import {PostsDbModel} from "../../models/mongo-db-models/posts-db-model";
import {LikeStatus} from "../../models/view-models/comments-view-model";


export const postsQueryRepository = {
    async findPosts (req: RequestWithQuery<QueryPostsModel>): Promise<Paginator<PostsType[]>> {
        const {sortBy, sortDir, pageNum, pageSize} = parsePostsQuery(req.query);

        let posts: PostsDbModel[];
        let filter = {};
        let sort = {[sortBy]: sortDir as SortOrder}
        let userId = req.userId ?? null

        posts = await PostModel.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .select('-__v')
            .lean()

        const output = [...posts] as PostsType[]
        for (const p of output) {
            let myStatus = LikeStatus.None
            const latestLikes = p.likes?.sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt)).slice(0, 3)

            if (userId) {
                const isLiked = p.likes?.find(u => u.userId.toString() === userId)
                const isDisliked = p.dislikes?.find(u => u.userId.toString() === userId)

                if (isDisliked) myStatus = LikeStatus.Dislike
                if (isLiked) myStatus = LikeStatus.Like
            }

            p.extendedLikesInfo = {
                likesCount: p.likes?.length ?? 0,
                dislikesCount: p.dislikes?.length ?? 0,
                myStatus: myStatus,
                newestLikes: latestLikes ?? []
            }

            delete p.likes
            delete p.dislikes

            changeKeyName(p, '_id', 'id')
        }


        const totalMatchedPosts = await PostModel.countDocuments(filter)
        const totalPages = Math.ceil(totalMatchedPosts / pageSize)

        return {
            pagesCount: totalPages,
            page: pageNum,
            pageSize: pageSize,
            totalCount: totalMatchedPosts,
            items: output ?? []
        };
    },
    async findPostsInBlog (req: RequestWithParamsAndQuery<{id: string}, QueryPostsModel>): Promise<Paginator<PostsType[]> | null | undefined>{
        const {sortBy, sortDir, pageNum, pageSize}= parsePostsQuery(req.query);
        let userId = req.userId ?? null

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

        const output = [...posts] as PostsType[]
        for (const p of output) {
            let myStatus = LikeStatus.None
            const latestLikes = p.likes?.sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt)).slice(0, 3)

            if (userId) {
                const isLiked = p.likes?.find(u => u.userId.toString() === userId)
                const isDisliked = p.dislikes?.find(u => u.userId.toString() === userId)

                if (isDisliked) myStatus = LikeStatus.Dislike
                if (isLiked) myStatus = LikeStatus.Like
            }

            p.extendedLikesInfo = {
                likesCount: p.likes?.length ?? 0,
                dislikesCount: p.dislikes?.length ?? 0,
                myStatus: myStatus,
                newestLikes: latestLikes ?? []
            }

            delete p.likes
            delete p.dislikes

            changeKeyName(p, '_id', 'id')
        }

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