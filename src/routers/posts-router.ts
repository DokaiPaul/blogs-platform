import {Router, Response, Request} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {postBodyValidationMiddleware} from "../middlewares/body-validation-middleware";
import {param} from "express-validator";
import {postsService} from "../domain/posts-service";

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {

    const posts = await postsService.findAllPosts()

    res.send(posts);
})

postsRouter.get('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {

    const post = await postsService.findPostById(req.params.id);
    if(!post) {
        res.sendStatus(404);
        return;
    }

    res.send(post);
})

postsRouter.post('/',
    authorizationMiddleware,
    postBodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const newPost = await postsService.createPost(req.body)
        if(!newPost) {
            res.sendStatus(400)
            return
        }

        res.status(201).json(newPost)
})

postsRouter.put('/:id',
    param('id').isMongoId(),
    authorizationMiddleware,
    postBodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        let post = await postsService.updatePost(req.params.id ,req.body)
        if(!post) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
})

postsRouter.delete('/:id',
    param('id').isMongoId(),
    authorizationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const result = await postsService.deletePostById(req.params.id)
        if(!result) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
})