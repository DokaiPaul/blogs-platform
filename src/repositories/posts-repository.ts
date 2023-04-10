import {InputPostType, PostsType} from "../types/posts-types";
import {client} from "../database/mongo-db";
import {BlogsType} from "../types/blogs-types";
import {changeKeyName} from "../utils/object-operations";
import {ObjectId} from "mongodb";

const postCollection = client.db('bloggers-platform').collection<PostsType>('posts')
const blogsCollection = client.db('bloggers-platform').collection<BlogsType>('blogs')
export const postsRepository = {
    async getAllPosts (): Promise<PostsType[]> {

        const posts = await postCollection.find({}).toArray();
        posts.forEach(b => changeKeyName(b, '_id','id'));

        return posts;
    },
    async getPostById (id: string): Promise<PostsType | null> {

        // @ts-ignore
        let post = await postCollection.findOne({_id: ObjectId(id)})
        if(!post) {
            return null;
        }
        changeKeyName(post, '_id', 'id')

        return post;
    },
    async createPost (body: PostsType): Promise<PostsType | undefined> {

        // @ts-ignore
        const blog: BlogsType | null = await blogsCollection.findOne({_id: ObjectId(body.blogId)});
        if(!blog?.name) {
            return undefined;
        }

        const newPost: PostsType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }

        await postCollection.insertOne(newPost)
        changeKeyName(newPost, '_id', 'id')

        return newPost;
    },
    async updatePost (id: string, body: InputPostType): Promise<boolean> {

        // @ts-ignore
        const result = await  postCollection.updateOne({_id: ObjectId(id)}, {$set: {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId
        }});

        return result.matchedCount === 1
    },
    async deletePost (id: string): Promise<boolean> {

        // @ts-ignore
        const result = await  postCollection.deleteOne({_id: ObjectId(id)})

        return result.deletedCount === 1;
    }
}