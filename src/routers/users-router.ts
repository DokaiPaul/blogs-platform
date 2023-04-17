import {Router, Response, Request} from "express";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {checkErrors} from "../middlewares/check-errors";
import {RequestWithQuery} from "../models/request-types";
import {QueryUsersModel} from "../models/query-models/query-users-model";
import {usersRepository} from "../repositories/users-repository";
import {userService} from "../domain/users-service";
import {UsersType} from "../models/view-models/users-view-model";
import {usersBodyValidationMiddleware} from "../middlewares/body-validation/body-validation-middleware";
import {param} from "express-validator";

export const usersRouter = Router({})

usersRouter.get('/', authorizationMiddleware, checkErrors, 
    async (req: RequestWithQuery<QueryUsersModel>, res: Response) => {
        const users = await usersQueryRepository.findUsers(req.query)
        res.send(users)
})

usersRouter.post('/', authorizationMiddleware, usersBodyValidationMiddleware, checkErrors,
    async (req: Request, res: Response) => {
        const user: UsersType = await userService.createUser(req.body)
        res.status(201).json(user)
})

usersRouter.delete('/:id', param('id').isMongoId() ,authorizationMiddleware, checkErrors,
    async (req: Request, res: Response) => {
        const result = await userService.deleteUser(req.params.id)
        if(!result) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
})