import {Request, Response, Router} from "express";
import {videos_db} from "../database/videos_db";
import {PostModel} from "../database/models/post-model";
import {BlogModel} from "../database/models/blog-model";
import {UserModel} from "../database/models/user-model";
import {CommentModel} from "../database/models/comment-model";
import {ActiveSessionModel} from "../database/models/active-session-model";


export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await PostModel.deleteMany({})
    await BlogModel.deleteMany({})
    await UserModel.deleteMany({})
    await CommentModel.deleteMany({})
    await ActiveSessionModel.deleteMany({})
    videos_db.splice(0, videos_db.length);
    res.sendStatus(204);
})