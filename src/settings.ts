import express, {Request, Response} from "express";
import {testingRouter} from "./routers/testing-router";
import {videosRouter} from "./routers/videos-router";

export const app = express();

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello! Checkout my videos by adding "/videos" to the current URL')
})

app.use('/testing', testingRouter);
app.use('/videos', videosRouter);