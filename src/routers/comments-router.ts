import {Router, Request, Response} from "express";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {commentsService} from "../domain/comments-service";
import {authMiddleware} from "../middlewares/autorization-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {commentBodyValidationMiddleware} from "../middlewares/body-validation/body-validation-middleware";
import {isMongoId} from "../middlewares/params-validation/common-validaton-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id', isMongoId, async (req: Request, res: Response) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.id)

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