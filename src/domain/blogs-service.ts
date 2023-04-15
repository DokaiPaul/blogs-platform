import {BlogInputType, BlogsType} from "../types/blogs-types";
import {changeKeyName} from "../utils/object-operations";
import {blogsRepository} from "../repositories/blogs-repository";

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
    async updateBlog (id: string , body:BlogInputType): Promise<boolean> {

        const result =  await blogsRepository.updateBlog(id, body);

        return  result.matchedCount === 1
    },
    async deleteBlog (id: string): Promise<boolean> {

        const result = await blogsRepository.deleteBlog(id);

        return result.deletedCount === 1
    }
}