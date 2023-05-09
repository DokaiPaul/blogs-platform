import {PostInputType} from "../models/input-models/posts-input-model";
import {ObjectId} from "mongodb";
import {DeletedObject} from "../models/additional-types/mongo-db-types";
import {PostsType} from "../models/view-models/posts-view-model";
import {PostModel} from "../database/models/post-model";


export const postsRepository = {
    async findAllPosts (): Promise<PostsType[] | null | undefined> {

        return PostModel.find({});
    },
    async findPostsInBlog (id: string): Promise<PostsType[] | null | undefined>{

        return PostModel.find({blogId: id})
    },
    async findPostById (id: string): Promise<PostsType | null | undefined> {

        return PostModel.findOne({_id: new ObjectId(id)});
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