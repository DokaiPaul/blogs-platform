import {BlogInputType} from "../models/input-models/blogs-input-model";
import {changeKeyName} from "../utils/object-operations";
import {blogsRepository} from "../repositories/blogs-repository";
import {PostInputType} from "../models/input-models/posts-input-model";
import {postsRepository} from "../repositories/posts-repository";
import {PostsType} from "../models/view-models/posts-view-model";
import {BlogsType} from "../models/view-models/blogs-view-model";
import {ObjectId} from "mongodb";
import {LikeStatus} from "../models/view-models/comments-view-model";
import {PostsDbModel} from "../models/mongo-db-models/posts-db-model";

export const blogsService = {
    async findAllBlogs (): Promise<BlogsType[] | {}> {

        const blogs = await blogsRepository.findAllBlogs();
        if(!blogs) return  {};
        blogs.forEach(b => changeKeyName(b, '_id','id'));

        return blogs;
    },
    async findBlogById (id: string): Promise<BlogsType | null> {

        const blog = await blogsRepository.findBlogById(id);

        if(!blog) return null;
        changeKeyName(blog, '_id', 'id')

        return blog;
    },
    async createBlog (body: BlogInputType): Promise<BlogsType> {

        const newBlog = {
            _id: new ObjectId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsRepository.createBlog(newBlog);
        changeKeyName(newBlog, '_id', 'id')

        return newBlog;
    },
    async createPost (id: string, body: PostInputType): Promise<PostsType | null> {

        const blog = await blogsRepository.findBlogById(id);

        if(!blog) return null;

        const newPost: PostsDbModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: id,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
            likes: [],
            dislikes: [],
        }

        await postsRepository.createPost(newPost)
        changeKeyName(newPost, '_id', 'id')

        const output = {
            ...newPost,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
        return output;
    },
    async updateBlog (id: string , body:BlogInputType): Promise<boolean> {

        const result =  await blogsRepository.updateBlog(id, body);

        return  result.matchedCount === 1
    },
    async deleteBlog (id: string): Promise<boolean> {

        const result = await blogsRepository.deleteBlog(id);

        return result.deletedCount === 1
    }
}