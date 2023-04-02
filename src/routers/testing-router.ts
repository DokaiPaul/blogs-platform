import {Request, Response, Router} from "express";
import {db} from "../database/db";
import {blogsRouter} from "./blogs-router";
import {blogs_db} from "../database/blogs-db";

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    db.splice(0, db.length);
    blogs_db.splice(0,  blogs_db.length)
    res.sendStatus(204);
})