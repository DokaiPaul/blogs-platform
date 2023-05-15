import {PostInputType} from "../models/input-models/posts-input-model";
import {ObjectId} from "mongodb";
import {DeletedObject} from "../models/additional-types/mongo-db-types";
import {PostsType} from "../models/view-models/posts-view-model";
import {PostModel} from "../database/models/post-model";
import {PostsDbModel} from "../models/mongo-db-models/posts-db-model";
import {LikeStatus} from "../models/view-models/comments-view-model";
import {ChangePostStatusTransferModel} from "../models/additional-types/data-transfer-object";
import {StatusData} from "../models/mongo-db-models/comments-db-model";


export const postsRepository = {
    async findAllPosts (): Promise<PostsType[] | null> {

        return PostModel.find({}).select('-__v').lean()
    },
    async findPostsInBlog (id: string): Promise<PostsType[] | null>{

        return PostModel.find({blogId: id}).select('-__v').lean()
    },
    async findPostById (id: string): Promise<PostsType | null> {

        return PostModel.findOne({_id: new ObjectId(id)}).select('-__v').lean()
    },
    //todo add type for output
    async createPost (post: PostsDbModel) {

        return await PostModel.create(post);
    },
    //todo add type for output
    async updatePost (id: string, body: PostInputType) {

        return PostModel.updateOne({_id: new ObjectId(id)}, {$set: {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId
        }});
    },
    async deletePostById (id: string): Promise<DeletedObject> {

        return PostModel.deleteOne({_id: new ObjectId(id)})
    },
    async addNewStatus(type: LikeStatus, {postId, userId, login}: ChangePostStatusTransferModel) {
        const status = type === LikeStatus.Like ? 'likes' : 'dislikes'

        return PostModel.updateOne(
            {_id: new ObjectId(postId)},
            {$push: {[status]: {
                        userId: userId,
                        addedAt: new Date(),
                        login: login
                    }}
            })
    },
    async removeCurrentStatus(type: LikeStatus, {postId, userId}: ChangePostStatusTransferModel) {
        const status = type === LikeStatus.Like ? 'likes' : 'dislikes'

        return PostModel.updateOne(
            {_id: new ObjectId(postId)},
            {$pull: {[status]: {userId: userId}}
            })
    },
    async findCurrentStatusByUser(type: LikeStatus, userId: string, postId: string): Promise<PostsType | null> {
        const status = type === LikeStatus.Like ? 'likes' : 'dislikes'

        return PostModel.findOne({_id: new Object(postId), [status]: {$elemMatch: {userId: userId}}})
    },
    async findThreeNewestLikes(postId: string): Promise<StatusData[] | null> {
        //@ts-ignore
        return PostModel.find({_id: new ObjectId(postId)}, {likes: 1, _id: 0}).sort({'likes.addedAt': -1}).limit(3)
    }
}