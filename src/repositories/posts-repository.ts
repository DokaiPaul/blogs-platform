import {InputPostType, PostsType} from "../types/posts-types";
import {client} from "../database/mongo-db";
import {ObjectId} from "mongodb";
import {DeletedObject, InsertedObject, UpdatedObject} from "../types/mongo-db-types";

const postCollection = client.db('bloggers-platform').collection<PostsType>('posts')
export const postsRepository = {
    async findAllPosts (): Promise<PostsType[] | null | undefined> {

        return await postCollection.find({}).toArray();
    },
    async findPostById (id: string): Promise<PostsType | null | undefined> {

        return await postCollection.findOne({_id: new ObjectId(id)});
    },
    async createPost (post: PostsType): Promise<InsertedObject> {

        return await postCollection.insertOne(post);
    },
    async updatePost (id: string, body: InputPostType): Promise<UpdatedObject> {

        return await postCollection.updateOne({_id: new ObjectId(id)}, {$set: {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId
        }});
    },
    async deletePostById (id: string): Promise<DeletedObject> {

        return await  postCollection.deleteOne({_id: new ObjectId(id)})
    }
}