import {Request, Response, Router} from "express";
import {videos_db} from "../database/videos_db";
import {client} from "../database/mongo-db";
import {PostsType} from "../types/posts-types";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await client.db('bloggers-platform').collection<PostsType>('posts').deleteMany({})
    await client.db('bloggers-platform').collection<PostsType>('blogs').deleteMany({})
    videos_db.splice(0, videos_db.length);
    res.sendStatus(204);
})