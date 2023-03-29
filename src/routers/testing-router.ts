import {Request, Response, Router} from "express";
import {db} from "../database/db";

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    db.splice(0, db.length);
    res.sendStatus(204);
})