import {Request, Response, Router} from "express";
import {db} from "../database/db";
import {postRequestValidate} from "../validation/post-request-validation";
import {VideoType} from "../types/videos-types";
import {putRequestValidate} from "../validation/put-request-validation";


export const videosRouter = Router({})
videosRouter.get('/', (req: Request, res: Response) => {
    res.send(db);
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    let video = db.find(v => v.id === +req.params.id);
    if(video) {
        res.json(video);
    }
    else {
        res.sendStatus(404);
    }
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    let index = db.findIndex((v => v.id === +req.params.id)) //looking for index of video to delete

    if(index === -1) {
        res.sendStatus(404);
        return;
    }
    db.splice(index, 1);
    res.sendStatus(204);
})

videosRouter.post('/', (req: Request, res: Response) => {
    const error = postRequestValidate(req.body);
    if(error.errorsMessages.length > 0) {
        res.status(400).json(error)
        return;
    }
    const title = req.body.title;
    const author = req.body.author;
    const resolutions = req.body.availableResolutions;

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

videosRouter.put('/:id', (req: Request, res: Response) => {
    let video = db.find(v => v.id === +req.params.id);
    if(!video) {
        res.sendStatus(404);
        return;
    }

    const error = putRequestValidate(req.body);
    if(error.errorsMessages.length > 0) {
        res.status(400).json(error);
        return;
    }

    if(req.body.title) {
        video.title = req.body.title;
    }
    if(req.body.author) {
        video.author = req.body.author;
    }
    if(req.body.canBeDownloaded !== undefined) { //there are cases when we need to set false for this parameter
        video.canBeDownloaded = req.body.canBeDownloaded;
    }
    if(req.body.createdAt) {
        video.createdAt = req.body.createdAt;
    }
    if(req.body.publicationDate) {
        video.publicationDate = req.body.publicationDate;
    }
    if(req.body.minAgeRestriction  !== undefined) { //there are cases where we need to set null for this parameter
        video.minAgeRestriction = req.body.minAgeRestriction;
    }
    if(req.body.availableResolutions) {
        video.availableResolutions = req.body.availableResolutions;
    }
    res.sendStatus(204);
})