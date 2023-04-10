import {Request, Response, Router} from "express";
import {bodyValidationMiddleware} from "../middlewares/body-validation-middleware";
import {blogsRepository} from "../repositories/blogs-repository";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {requiredFieldsValidationMiddleware} from "../middlewares/required-fields-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";

export const blogsRouter = Router({})



blogsRouter.get('/', async (req: Request, res: Response) => {

    const blogs = await blogsRepository.getAllBlogs();
    res.send(blogs);
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {

    const blog = await blogsRepository.getBlogById(req.params.id);
    if(!blog) {
        res.sendStatus(404);
        return;
    }

    res.send(blog);
})

blogsRouter.use(authorizationMiddleware);
blogsRouter.post('/' ,
    requiredFieldsValidationMiddleware,
    bodyValidationMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const newBlog = await blogsRepository.createBlog(req.body)

        res.status(201).json(newBlog);
})

blogsRouter.put('/:id',
    requiredFieldsValidationMiddleware,
    bodyValidationMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const blog = await blogsRepository.updateBlog(req.params.id ,req.body)
        if(!blog) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204)
})

blogsRouter.delete('/:id',
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const result = await blogsRepository.deleteBlog(req.params.id)
        if(!result) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
})
