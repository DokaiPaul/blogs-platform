import express, {Request, Response} from "express";
import {testingRouter} from "./routers/testing-router";
import {videosRouter} from "./routers/videos-router";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {usersRouter} from "./routers/users-router";
import {authRouter} from "./routers/auth-router";
import {commentsRouter} from "./routers/comments-router";

export const app = express();

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello! Checkout content by adding "/videos", "/posts" or "/blogs" to the current URL')
})

app.use('/testing', testingRouter);
app.use('/videos', videosRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);