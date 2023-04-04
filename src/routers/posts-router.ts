import {Router, Response, Request} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {postBodyValidationMiddleware} from "../middlewares/blog-body-validation-middleware";
import {postsRepository} from "../repositories/posts-repository";

export const postsRouter = Router({});

postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getAllRepositories()
    res.send(posts);
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const post = postsRepository.getRepositoryByID(req.params.id);
    if(!post) {
        res.sendStatus(404);
        return;
    }
    res.send(post);
})

postsRouter.use(authorizationMiddleware);
postsRouter.post('/',postBodyValidationMiddleware ,inputValidationMiddleware, (req: Request, res: Response) => {
    const newPost = postsRepository.createRepository(req.body)
    res.status(201).json(newPost)
})

postsRouter.put('/:id', postBodyValidationMiddleware ,inputValidationMiddleware,(req: Request, res: Response) => {
    let post = postsRepository.getRepositoryByID(req.params.id);
    if(!post) {
        res.sendStatus(404);
        return;
    }
    postsRepository.updateRepository(post ,req.body)
    res.sendStatus(204)
})

postsRouter.delete('/:id', inputValidationMiddleware, (req: Request, res: Response) => {
    const status = postsRepository.deleteRepository(req.params.id)
    res.sendStatus(status);
})