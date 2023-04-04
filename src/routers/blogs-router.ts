import {Request, Response, Router} from "express";
import {blogBodyValidationMiddleware} from "../middlewares/blog-body-validation-middleware";
import {blogsRepository} from "../repositories/blogs-repository";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {requiredFieldsValidationMiddleware} from "../middlewares/required-fields-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";

export const blogsRouter = Router({})



blogsRouter.get('/', (req: Request, res: Response) => {
    const blogs = blogsRepository.getAllRepositories();
    res.send(blogs);
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blog = blogsRepository.getRepositoryById(req.params.id);
    if(!blog) {
        res.sendStatus(404);
        return;
    }
    res.send(blog);
})

blogsRouter.use(authorizationMiddleware);
blogsRouter.post('/' , requiredFieldsValidationMiddleware, blogBodyValidationMiddleware, inputValidationMiddleware,
    (req: Request, res: Response) => {
        const newBlog = blogsRepository.createRepository(req.body)
        res.status(201).json(newBlog);
})

blogsRouter.put('/:id', requiredFieldsValidationMiddleware, blogBodyValidationMiddleware, inputValidationMiddleware,
    (req: Request, res: Response) => {
        let blog = blogsRepository.getRepositoryById(req.params.id);
        if(!blog) {
            res.sendStatus(404);
            return;
        }
        blogsRepository.updateRepository(blog ,req.body)
        res.sendStatus(204)
})

blogsRouter.delete('/:id', inputValidationMiddleware, (req: Request, res: Response) => {
    const status = blogsRepository.deleteRepository(req.params.id)
    res.sendStatus(status);
})
