import express, {Request, Response} from "express";
import {db, VideoType} from "./db";
import {postRequestValidate} from "./post-request-validation";
import {putRequestValidate} from "./put-request-validation";

const app = express();

const port = 3000;


const jsonBodyMiddlware = express.json();
app.use(jsonBodyMiddlware);



app.get('/videos', (req: Request, res: Response) => {
    res.send(db);
})

app.get('/videos/:id', (req: Request, res: Response) => {
    let video = db.find(v => v.id === +req.params.id);
    if(video) {
        res.json(video);
    }
    else {
        res.sendStatus(404);
    }
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.splice(0, db.length);
    res.sendStatus(204);
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    let index = db.findIndex((v => v.id === +req.params.id)) //looking for index of video to delete

    if(!index) {
        res.sendStatus(404);
        return;
    }
    db.splice(index, 1);
    res.sendStatus(204);
})

app.post('/videos', (req: Request, res: Response) => {
    const error = postRequestValidate(req.body);
    if(error.length > 0) {
        res.status(400).json(error)
        return;
    }
    const title = req.body.title;
    const author = req.body.author;
    const resolutions = req.body.availableResolutions;
    const day = new Date().getDate();

    let createdDate = new Date().toISOString();
    if(req.body.createdAt) {
        createdDate = req.body.createdAt
    }
    let publicateDate = new Date(new Date(createdDate).setDate(new Date(createdDate).getDate() + 1)).toISOString();
    if(req.body.publicationDate) {
        publicateDate = req.body.publicationDate
    }
    let allowDownload: boolean = false;
    if(req.body.canBeDownloaded) {
        allowDownload = req.body.canBeDownloaded
    }
    let ageRestriction = null;
    if(req.body.minAgeRestriction) {
        ageRestriction = req.body.minAgeRestriction
    }
    const id: number = db.reduce((acc: number,v: VideoType) => acc < v.id
        ? acc = v.id
        : acc, 0) + 1;

    let toCreate: VideoType = {
        id: id,
        title: title,
        author: author,
        canBeDownloaded: allowDownload,
        minAgeRestriction: ageRestriction,
        createdAt: createdDate,
        publicationDate: publicateDate,
        availableResolutions: resolutions
    };

    db.push(toCreate);
    res.status(201).json(toCreate);
})

app.put('/videos/:id', (req: Request, res: Response) => {
    let video = db.find(v => v.id === +req.params.id);
    if(!video) {
        res.sendStatus(404);
        return;
    }

    const error = putRequestValidate(req.body);
    if(error.length > 0) {
        res.status(400).json(error);
        return;
    }
    if(req.body.title) {
        video.title = req.body.title
    }
    if(req.body.author) {
        video.author = req.body.author
    }
    if(req.body.canBeDownloaded) {
        video.canBeDownloaded = req.body.canBeDownloaded
    }
    if(req.body.createdAt) {
        video.createdAt = req.body.createdAt
    }
    if(req.body.publicationDate) {
        video.publicationDate = req.body.publicationDate
    }
    if(req.body.minAgeRestriction) {
        video.minAgeRestriction = req.body.minAgeRestriction
    }
    if(req.body.availableResolutions) {
        video.availableResolutions = req.body.availableResolutions
    }
    res.sendStatus(204);
})

app.listen(port, () => {
    console.log(`App has been launched on port ${port}`);
})