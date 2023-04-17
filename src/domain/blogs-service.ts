import {BlogInputType, BlogsType} from "../models/input-models/blogs-input-model";
import {changeKeyName} from "../utils/object-operations";
import {blogsRepository} from "../repositories/blogs-repository";
import {PostInputType, PostsType} from "../models/input-models/posts-input-model";
import {postsRepository} from "../repositories/posts-repository";

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

        const newPost: PostsType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: id,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }

        await postsRepository.createPost(newPost)
        changeKeyName(newPost, '_id', 'id')
        return newPost;
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