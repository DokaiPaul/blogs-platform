import {Router, Request, Response} from "express";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {commentsService} from "../domain/comments-service";
import {authMiddleware, checkUserIdByJWT} from "../middlewares/autorization-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {commentBodyValidationMiddleware} from "../middlewares/body-validation/body-validation-middleware";
import {isMongoId} from "../middlewares/params-validation/common-validaton-middleware";
import {likeStatus} from "../middlewares/body-validation/common-validation-middleware";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";

export const commentsRouter = Router({})

commentsRouter.get('/:id', isMongoId, checkUserIdByJWT, async (req: Request, res: Response) => {
    const userId = req.userId ?? null
    const comment = await commentsQueryRepository.findCommentById(req.params.id, userId)

    if(!comment) {
        res.sendStatus(404)
        return
    }

    res.json(comment)
})

commentsRouter.put('/:id',
    isMongoId,
    authMiddleware,
    commentBodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

    const result = await commentsService.updateComment(req)

    if (result === 'wrong id') {
        res.sendStatus(404)
        return
    }

    if(result === 'not owner') {
        res.sendStatus(403)
        return
    }

    res.sendStatus(204)
})

//todo add sending like status (none, like, dislike)
commentsRouter.put('/:id/like-status',
    isMongoId,
    authMiddleware,
    likeStatus,
    checkErrors,
    async (req: Request, res: Response) => {

        if(!req.userId) {
            res.sendStatus(401)
            return
        }

        const comment = await commentsQueryRepository.findCommentById(req.params.id, req.userId)
        const userLogin = await usersQueryRepository.findUserById(req.userId)

        if(!comment) {
            res.sendStatus(404)
            return
        }

        if(!userLogin?.login) {
            res.sendStatus(500)
            return
        }

        const statusTransferObject = {
            status: req.body.likeStatus,
            userId: req.userId,
            commentId: req.params.id,
            login: userLogin.login
        }

        await commentsService.setLikeDislikeStatus(statusTransferObject)

        res.sendStatus(204)
})

commentsRouter.delete('/:id',
    isMongoId,
    authMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {
    const result = await commentsService.deleteComment(req)

    if (result === 'wrong id') {
        res.sendStatus(404)
        return
    }

    if(result === 'not owner') {
        res.sendStatus(403)
        return
    }

    res.sendStatus(204)
})