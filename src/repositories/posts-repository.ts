import {InputPostType, PostsType} from "../types/posts-types";
import {blogs_db} from "../database/blogs-db";
import {posts_db} from "../database/posts-db";
import {client} from "../database/mongo-db";
import {blogsCollection} from "./blogs-repository";

const postCollection = client.db('bloggers-platform').collection<PostsType>('posts')
export const postsRepository = {
    async getAllPosts (): Promise<PostsType[]> {
        const posts = postCollection.find({}, {projection: {_id: 0}}).toArray();
        return posts;
    },
    async getPostById (id: string): Promise<PostsType | null> {
        const post = postCollection.findOne({id: id}, {projection: {_id: 0}})
        return post;
    },
    async createPost (body: PostsType): Promise<PostsType> {
    const blogName = await blogsCollection.findOne({id: body.blogId})
        const newPost = {
            id: Date.now().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName?.name,
            createdAt: new Date().toISOString(),
        }

        // @ts-ignore
        const result = await postCollection.insertOne(newPost)
        // @ts-ignore
        const {_id, ...post} = newPost;
        // @ts-ignore
        return post
    },
    async updatePost (id: string, body: InputPostType): Promise<boolean> {
        const result = await  postCollection.updateOne({id: id}, {$set: {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId
        }});

        return result.matchedCount === 1
    },
    async deletePost (id: string): Promise<boolean> {
        const result = await  postCollection.deleteOne({id: id})
        return result.deletedCount === 1;
    }
}