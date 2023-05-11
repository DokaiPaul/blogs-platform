import {Router, Response, Request} from "express";
import {adminAuthMiddleware} from "../middlewares/admin-auth-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {
    commentBodyValidationMiddleware,
    postBodyValidationMiddleware
} from "../middlewares/body-validation/body-validation-middleware";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {RequestWithParamsAndQuery, RequestWithQuery} from "../models/request-types";
import {QueryPostsModel} from "../models/query-models/query-posts-model";
import {authMiddleware} from "../middlewares/autorization-middleware";
import {commentsService} from "../domain/comments-service";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {QueryCommentsModel} from "../models/query-models/query-comments-model";
import {isMongoId} from "../middlewares/params-validation/common-validaton-middleware";

export const postsRouter = Router({});

postsRouter.get('/', async (req: RequestWithQuery<QueryPostsModel>, res: Response) => {

    const posts = await postsQueryRepository.findPosts(req);
    res.send(posts);
})

postsRouter.get('/:id', isMongoId, checkErrors, async (req: Request, res: Response) => {

    const post = await postsService.findPostById(req.params.id);
    if(!post) {
        res.sendStatus(404);
        return;
    }

    res.send(post);
})

postsRouter.get('/:id/comments',
    isMongoId,
    checkErrors,
    async (req: RequestWithParamsAndQuery<{id: string}, QueryCommentsModel>, res: Response) => {
        const post = await postsService.findPostById(req.params.id)

        if(!post) {
            res.sendStatus(404)
            return
        }

        const comments = await commentsQueryRepository.findCommentsInPost(req)
        res.status(200).send(comments)
})

postsRouter.post('/:id/comments',
    isMongoId,
    authMiddleware,
    commentBodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {
    const post = await postsService.findPostById(req.params.id)

    if(!post) {
        res.sendStatus(404)
        return
    }

    const newComment = await commentsService.createComment(req)
    res.status(201).json(newComment)

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
    isMongoId,
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
    isMongoId,
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