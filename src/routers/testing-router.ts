import {Request, Response, Router} from "express";
import {videos_db} from "../database/videos_db";
import {client} from "../database/mongo-db";
import {PostsType} from "../models/view-models/posts-view-model";
import {BlogsType} from "../models/view-models/blogs-view-model";
import {UsersType} from "../models/view-models/users-view-model";


export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await client.db('bloggers-platform').collection<PostsType>('posts').deleteMany({})
    await client.db('bloggers-platform').collection<BlogsType>('blogs').deleteMany({})
    await client.db('bloggers-platform').collection<UsersType>('users').deleteMany({})
    videos_db.splice(0, videos_db.length);
    res.sendStatus(204);
})