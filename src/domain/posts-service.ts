import {PostInputType} from "../models/input-models/posts-input-model";
import {changeKeyName} from "../utils/object-operations";
import {ObjectId} from "mongodb";
import {postsRepository} from "../repositories/posts-repository";
import {BlogsType} from "../models/view-models/blogs-view-model";
import {PostsType} from "../models/view-models/posts-view-model";
import {BlogModel} from "../database/models/blog-model";
import {ChangePostStatusTransferModel} from "../models/additional-types/data-transfer-object";
import {PostsDbModel} from "../models/mongo-db-models/posts-db-model";
import {LikeStatus} from "../models/view-models/comments-view-model";

export const postsService = {
    async findPostById (id: string, userId: string | null): Promise<PostsType | null> {

        let post = await postsRepository.findPostById(id);
        if(!post) return null;

        let myStatus = LikeStatus.None
        const latestLikes = post.likes?.sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))

        if (userId) {
            const isLiked = post.likes?.find(u => u.userId.toString() === userId)
            const isDisliked = post.dislikes?.find(u => u.userId.toString() === userId)

            if (isDisliked) myStatus = LikeStatus.Dislike
            if (isLiked) myStatus = LikeStatus.Like
        }

        post.extendedLikesInfo = {
            likesCount: post.likes?.length ?? 0,
            dislikesCount: post.dislikes?.length ?? 0,
            myStatus: myStatus,
            newestLikes: latestLikes ?? []
        }

        delete post.likes
        delete post.dislikes

        changeKeyName(post, '_id', 'id')

        return post;
    },
    async createPost (body: PostsType): Promise<PostsType> {

        const blog: BlogsType | null = await BlogModel.findOne({_id: new ObjectId(body.blogId)});

        const newPost: PostsDbModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog!.name,
            likes: [],
            dislikes: [],
            createdAt: new Date().toISOString(),
        }

        await postsRepository.createPost(newPost)
        changeKeyName(newPost, '_id', 'id')

        const post: PostsType = {
            ...newPost,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
        delete post.likes
        delete post.dislikes

        return post;
    },
    async updatePost (id: string, body: PostInputType): Promise<boolean> {

        const result = await postsRepository.updatePost(id, body);

        return result.matchedCount === 1
    },
    async setLikeDislikeStatus(statusData: ChangePostStatusTransferModel) {
        const {status, postId, userId} = statusData

        let currentStatus = 'None'
        const isAlreadyLiked = await postsRepository.findCurrentStatusByUser(LikeStatus.Like, userId, postId)
        if(isAlreadyLiked) currentStatus = 'Like'

        const isAlreadyDisliked = await postsRepository.findCurrentStatusByUser(LikeStatus.Dislike, userId, postId)
        if(isAlreadyDisliked) currentStatus = 'Dislike'

        if(currentStatus === status) return false

        if(currentStatus === 'None') {
            const result = await this.addNewStatus(statusData)
            return result
        }

        const result = await this.changeCurrentStatus(statusData)
        return result
    },
    async addNewStatus(statusData: ChangePostStatusTransferModel): Promise<boolean | null> {
        const {status} = statusData

        if(status === 'Like') {
            const result = await postsRepository.addNewStatus(LikeStatus.Like, statusData)
            if(!result) return false
            return true
        }
        if(status === 'Dislike') {
            const result = await postsRepository.addNewStatus(LikeStatus.Dislike, statusData)
            if(!result) return false
            return true
        }
        return null
    },
    async changeCurrentStatus(statusData: ChangePostStatusTransferModel) {
        const {status, userId, postId} = statusData

        if(status === 'Like') {
            const result = await  postsRepository.addNewStatus(LikeStatus.Like, statusData)
            if(!result) return false

            const isRemoved = await postsRepository.removeCurrentStatus(LikeStatus.Dislike, statusData)
            if(!isRemoved) return false

            return true
        }
        if(status === 'Dislike') {
            const result = await  postsRepository.addNewStatus(LikeStatus.Dislike, statusData)
            if(!result) return false

            const isRemoved = await postsRepository.removeCurrentStatus(LikeStatus.Like, statusData)
            if(!isRemoved) return false

            return true
        }
        //if status is None than execute code below
        const isLiked = await postsRepository.findCurrentStatusByUser(LikeStatus.Like, userId, postId)
        if(isLiked) {
            const result = await postsRepository.removeCurrentStatus(LikeStatus.Like, statusData)
            if(!result) return false
            return true
        }

        const isDisliked = await postsRepository.findCurrentStatusByUser(LikeStatus.Dislike, userId, postId)
        if(isDisliked) {
            const result = await postsRepository.removeCurrentStatus(LikeStatus.Dislike, statusData)
            if(!result) return false
            return true
        }
        return null
    },
    async deletePostById (id: string): Promise<boolean> {

        const result = await  postsRepository.deletePostById(id);

        return result.deletedCount === 1;
    }
}