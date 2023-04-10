import {Router, Response, Request} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {postBodyValidationMiddleware} from "../middlewares/body-validation-middleware";
import {postsRepository} from "../repositories/posts-repository";

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {

    const posts = await postsRepository.getAllPosts()

    res.send(posts);
})

postsRouter.get('/:id', async (req: Request, res: Response) => {

    const post = await postsRepository.getPostById(req.params.id);
    if(!post) {
        res.sendStatus(404);
        return;
    }

    res.send(post);
})

postsRouter.use(authorizationMiddleware);
postsRouter.post('/',
    postBodyValidationMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const newPost = await postsRepository.createPost(req.body)
        if(!newPost) {
            res.sendStatus(400)
            return
        }

        res.status(201).json(newPost)
})

postsRouter.put('/:id',
    postBodyValidationMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

    let post = await postsRepository.updatePost(req.params.id ,req.body)
    if(!post) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(204);
})

postsRouter.delete('/:id',
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

    const result = await postsRepository.deletePost(req.params.id)
    if(!result) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(204);
})