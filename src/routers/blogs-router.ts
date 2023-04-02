import {Request, Response, Router} from "express";
import {blogs_db} from "../database/blogs-db";
import {blogBodyValidationMiddleware} from "../middlewares/blog-body-validation-middleware";
import {blogsRepository} from "../repositories/blogs-repository";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {requiredFieldsValidationMiddleware} from "../middlewares/required-fields-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";

export const blogsRouter = Router({})



blogsRouter.get('/', (req: Request, res: Response) => {
    res.send(blogs_db);
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blog = blogs_db.find(v => v.id === req.params.id);
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
        let blog = blogs_db.find(v => v.id === req.params.id);
        if(!blog) {
            res.sendStatus(404);
            return;
        }
        blogsRepository.updateRepository(blog ,req.body)
        res.sendStatus(204)
})

blogsRouter.delete('/:id', inputValidationMiddleware, (req: Request, res: Response) => {
    const index = blogs_db.findIndex(b => b.id === req.params.id)

    if(index === -1) {
        res.sendStatus(404);
        return;
    }
    blogs_db.splice(index, 1);
    res.sendStatus(204);
})
