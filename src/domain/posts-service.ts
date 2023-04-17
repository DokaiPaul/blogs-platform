import {PostInputType, PostsType} from "../models/input-models/posts-input-model";
import {client} from "../database/mongo-db";
import {BlogsType} from "../models/input-models/blogs-input-model";
import {changeKeyName} from "../utils/object-operations";
import {ObjectId} from "mongodb";
import {postsRepository} from "../repositories/posts-repository";
import {blogsService} from "./blogs-service";

const blogsCollection = client.db('bloggers-platform').collection<BlogsType>('blogs')
export const postsService = {
    async findAllPosts (): Promise<PostsType[] | {}> {

        const posts = await postsRepository.findAllPosts();
        if(!posts) return {};
        posts.forEach(b => changeKeyName(b, '_id','id'));

        return posts;
    },
    async findPostsInBlog (id: string): Promise<PostsType[] | null | undefined> {
        const blog = await blogsService.findBlogById(id);

        if(!blog) return null

        return await postsRepository.findPostsInBlog(id)
    },
    async findPostById (id: string): Promise<PostsType | null> {

        let post = await postsRepository.findPostById(id);
        if(!post) return null;
        changeKeyName(post, '_id', 'id')

        return post;
    },
    async createPost (body: PostsType): Promise<PostsType> {

        const blog: BlogsType | null = await blogsCollection.findOne({_id: new ObjectId(body.blogId)});

        const newPost: PostsType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
        }

        await postsRepository.createPost(newPost)
        changeKeyName(newPost, '_id', 'id')

        return newPost;
    },
    async updatePost (id: string, body: PostInputType): Promise<boolean> {

        const result = await postsRepository.updatePost(id, body);

        return result.matchedCount === 1
    },
    async deletePostById (id: string): Promise<boolean> {

        const result = await  postsRepository.deletePostById(id);

        return result.deletedCount === 1;
    }
}