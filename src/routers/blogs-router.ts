import {Request, Response, Router} from "express";
import {bodyValidationMiddleware, postInBlogBodyValidationMiddleware} from "../middlewares/body-validation-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {param} from "express-validator";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";

export const blogsRouter = Router({})



blogsRouter.get('/', async (req: Request, res: Response) => {

    const blogs = await blogsService.findAllBlogs();
    res.send(blogs);
})

blogsRouter.get('/:id', param('id').isMongoId(), checkErrors, async (req: Request, res: Response) => {

    const blog = await blogsService.findBlogById(req.params.id);
    if(!blog) {
        res.sendStatus(404);
        return;
    }

    res.send(blog);
})

blogsRouter.get('/:id/posts', param('id').isMongoId(), checkErrors, async (req: Request, res: Response) => {
    const blogs = await postsService.findPostsInBlog(req.params.id);

    if(!blogs) {
        res.sendStatus(404);
        return
    }

    res.send(blogs)
})

blogsRouter.post('/' ,
    authorizationMiddleware,
    bodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const newBlog = await blogsService.createBlog(req.body)

        res.status(201).json(newBlog);
})

blogsRouter.post('/:id/posts',
    param('id').isMongoId(),
    authorizationMiddleware,
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
    param('id').isMongoId(),
    authorizationMiddleware,
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
    param('id').isMongoId(),
    authorizationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const result = await blogsService.deleteBlog(req.params.id)
        if(!result) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
})
