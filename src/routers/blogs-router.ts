import {Request, Response, Router} from "express";
import {bodyValidationMiddleware, postInBlogBodyValidationMiddleware} from "../middlewares/body-validation/body-validation-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {adminAuthMiddleware} from "../middlewares/admin-auth-middleware";
import {blogsService} from "../domain/blogs-service";
import {RequestWithParamsAndQuery} from "../models/request-types";
import {QueryBlogsModel} from "../models/query-models/query-blogs-model";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {QueryPostsModel} from "../models/query-models/query-posts-model";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {isMongoId} from "../middlewares/params-validation/common-validaton-middleware";

export const blogsRouter = Router({})



blogsRouter.get('/', async (req: RequestWithParamsAndQuery<{id: string},QueryBlogsModel>, res: Response) => {

    const blogs = await blogsQueryRepository.findBlogs(req);
    res.send(blogs);
})

blogsRouter.get('/:id', isMongoId, checkErrors,
    async (req: Request, res: Response) => {

    const blog = await blogsService.findBlogById(req.params.id);
    if(!blog) {
        res.sendStatus(404);
        return;
    }

    res.send(blog);
})

blogsRouter.get('/:id/posts', isMongoId, checkErrors,
    async (req: RequestWithParamsAndQuery<{id: string}, QueryPostsModel>, res: Response) => {

    const blogs = await postsQueryRepository.findPostsInBlog(req);

    if(!blogs) {
        res.sendStatus(404);
        return
    }

    res.send(blogs)
})

blogsRouter.post('/' ,
    adminAuthMiddleware,
    bodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const newBlog = await blogsService.createBlog(req.body)

        res.status(201).json(newBlog);
})

blogsRouter.post('/:id/posts',
    isMongoId,
    adminAuthMiddleware,
    postInBlogBodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {
        const newPost = await blogsService.createPost(req.params.id, req.body)

        if(!newPost) {
            res.sendStatus(404);
            return
        }

        res.status(201).json(newPost);
})

blogsRouter.put('/:id',
    isMongoId,
    adminAuthMiddleware,
    bodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const blog = await blogsService.updateBlog(req.params.id ,req.body)
        if(!blog) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204)
})

blogsRouter.delete('/:id',
    isMongoId,
    adminAuthMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const result = await blogsService.deleteBlog(req.params.id)
        if(!result) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
})
