import {PostInputType} from "../models/input-models/posts-input-model";
import {ObjectId} from "mongodb";
import {DeletedObject} from "../models/additional-types/mongo-db-types";
import {PostsType} from "../models/view-models/posts-view-model";
import {PostModel} from "../database/models/post-model";


export const postsRepository = {
    async findAllPosts (): Promise<PostsType[] | null> {

        return PostModel.find({}).lean();
    },
    async findPostsInBlog (id: string): Promise<PostsType[] | null>{

        return PostModel.find({blogId: id}).lean()
    },
    async findPostById (id: string): Promise<PostsType | null> {

        return PostModel.findOne({_id: new ObjectId(id)}).lean();
    },
    //todo add type for output
    async createPost (post: PostsType) {

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
    }
}