import {Request, Response, Router} from "express";
import {videos_db} from "../database/videos_db";
import {blogs_db} from "../database/blogs-db";
import {posts_db} from "../database/posts-db";

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    videos_db.splice(0, videos_db.length);
    blogs_db.splice(0,  blogs_db.length);
    posts_db.splice(0, posts_db.length);
    res.sendStatus(204);
})