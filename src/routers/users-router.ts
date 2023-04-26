import {Router, Response, Request} from "express";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {adminAuthMiddleware} from "../middlewares/admin-auth-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {RequestWithQuery} from "../models/request-types";
import {QueryUsersModel} from "../models/query-models/query-users-model";
import {userService} from "../domain/users-service";
import {usersBodyValidationMiddleware} from "../middlewares/body-validation/body-validation-middleware";
import {param} from "express-validator";

export const usersRouter = Router({})

usersRouter.get('/', adminAuthMiddleware, checkErrors,
    async (req: RequestWithQuery<QueryUsersModel>, res: Response) => {
        const users = await usersQueryRepository.findUsers(req.query)
        res.send(users)
})

usersRouter.post('/', adminAuthMiddleware, usersBodyValidationMiddleware, checkErrors,
    async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body)
        res.status(201).json(user)
})

usersRouter.delete('/:id', param('id').isMongoId() ,adminAuthMiddleware, checkErrors,
    async (req: Request, res: Response) => {
        const result = await userService.deleteUser(req.params.id)
        if(!result) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
})