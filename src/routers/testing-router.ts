import {Request, Response, Router} from "express";
import {videos_db} from "../database/videos_db";
import {client} from "../database/mongo-db";
import {CommentsDbModel} from "../models/mongo-db-models/comments-db-model";
import {UserDbModel} from "../models/mongo-db-models/users-db-model";
import {BlogsDbModel} from "../models/mongo-db-models/blogs-db-model";
import {PostsDbModel} from "../models/mongo-db-models/posts-db-model";
import {ActiveSessionModel} from "../models/mongo-db-models/active-session-model";


export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await client.db('bloggers-platform').collection<PostsDbModel>('posts').deleteMany({})
    await client.db('bloggers-platform').collection<BlogsDbModel>('blogs').deleteMany({})
    await client.db('bloggers-platform').collection<UserDbModel>('users').deleteMany({})
    await client.db('bloggers-platform').collection<CommentsDbModel>('comments').deleteMany({})
    await client.db('bloggers-platform').collection<ActiveSessionModel>('active-sessions').deleteMany({})
    videos_db.splice(0, videos_db.length);
    res.sendStatus(204);
})