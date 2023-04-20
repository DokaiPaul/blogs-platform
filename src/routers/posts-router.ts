import {Router, Response, Request} from "express";
import {adminAuthMiddleware} from "../middlewares/admin-auth-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {postBodyValidationMiddleware} from "../middlewares/body-validation/body-validation-middleware";
import {param} from "express-validator";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {RequestWithQuery} from "../models/request-types";
import {QueryPostsModel} from "../models/query-models/query-posts-model";

export const postsRouter = Router({});

postsRouter.get('/', async (req: RequestWithQuery<QueryPostsModel>, res: Response) => {

    const posts = await postsQueryRepository.findPosts(req);
    res.send(posts);
})

postsRouter.get('/:id', param('id').isMongoId(), checkErrors, async (req: Request, res: Response) => {

    const post = await postsService.findPostById(req.params.id);
    if(!post) {
        res.sendStatus(404);
        return;
    }

    res.send(post);
})
//todo add two routers below for process comments in posts
postsRouter.get('/:id/comments', param('id').isMongoId(), checkErrors, async (req: Request, res: Response) => {

})

postsRouter.post('/:id/comments', param('id').isMongoId(), checkErrors, async (req: Request, res: Response) => {

})

postsRouter.post('/',
    adminAuthMiddleware,
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
    adminAuthMiddleware,
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
    adminAuthMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const result = await postsService.deletePostById(req.params.id)
        if(!result) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
})