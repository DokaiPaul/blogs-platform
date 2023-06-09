import {Router, Response, Request} from "express";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {adminAuthMiddleware} from "../middlewares/admin-auth-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {RequestWithQuery} from "../models/request-types";
import {QueryUsersModel} from "../models/query-models/query-users-model";
import {userService} from "../domain/users-service";
import {usersBodyValidationMiddleware} from "../middlewares/body-validation/body-validation-middleware";
import {isMongoId} from "../middlewares/params-validation/common-validaton-middleware";

export const usersRouter = Router({})

usersRouter.get('/', adminAuthMiddleware, checkErrors,
    async (req: RequestWithQuery<QueryUsersModel>, res: Response) => {
        const users = await usersQueryRepository.findUsers(req.query)
        res.send(users)
})

usersRouter.post('/', adminAuthMiddleware, usersBodyValidationMiddleware, checkErrors,
    async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body)
        if(!user) {
            res.sendStatus(400)
            return
        }

        if(user === 'email') {
            res.status(400).json({ errorsMessages: [{ message: 'This email is already taken', field: "email" }] })
            return
        }

        if(user === 'login') {
            res.status(400).json({ errorsMessages: [{ message: 'This login is already taken', field: "login" }] })
            return
        }

        res.status(201).json(user)
})

usersRouter.delete('/:id', isMongoId ,adminAuthMiddleware, checkErrors,
    async (req: Request, res: Response) => {
        const result = await userService.deleteUser(req.params.id)
        if(!result) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
})