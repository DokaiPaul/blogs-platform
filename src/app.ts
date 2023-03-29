import express from "express";
import {testingRouter} from "./routers/testing-router";
import {videosRouter} from "./routers/videos-router";

const app = express();

const port = 3000;


const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/testing', testingRouter);
app.use('/videos', videosRouter);


app.listen(port, () => {
    console.log(`App has been launched on port ${port}`);
})