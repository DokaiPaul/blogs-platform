import {Request, Response, Router} from "express";
import {bodyValidationMiddleware} from "../middlewares/body-validation-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {requiredFieldsValidationMiddleware} from "../middlewares/required-fields-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {param} from "express-validator";
import {blogsService} from "../domain/blogs-service";

export const blogsRouter = Router({})



blogsRouter.get('/', async (req: Request, res: Response) => {

    const blogs = await blogsService.findAllBlogs();
    res.send(blogs);
})

blogsRouter.get('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {

    const blog = await blogsService.findBlogById(req.params.id);
    if(!blog) {
        res.sendStatus(404);
        return;
    }

    res.send(blog);
})

blogsRouter.get('/:id/posts', param('id').isMongoId(), async (req: Request, res: Response) => {

})

blogsRouter.post('/' ,
    authorizationMiddleware,
    requiredFieldsValidationMiddleware,
    bodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const newBlog = await blogsService.createBlog(req.body)

        res.status(201).json(newBlog);
})

blogsRouter.post('/:id/posts',
    param('id').isMongoId(),
    authorizationMiddleware,
    requiredFieldsValidationMiddleware,
    bodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

})

blogsRouter.put('/:id',
    param('id').isMongoId(),
    authorizationMiddleware,
    requiredFieldsValidationMiddleware,
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
