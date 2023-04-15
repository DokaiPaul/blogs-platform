import {Request, Response, Router} from "express";
import {videos_db} from "../database/videos_db";
import {postRequestValidate} from "../utils/validation/post-request-validation";
import {VideoType} from "../types/videos-types";
import {putRequestValidate} from "../utils/validation/put-request-validation";


export const videosRouter = Router({})
videosRouter.get('/', (req: Request, res: Response) => {
    res.send(videos_db);
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    let video = videos_db.find(v => v.id === +req.params.id);
    if(video) {
        res.json(video);
    }
    else {
        res.sendStatus(404);
    }
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    let index = videos_db.findIndex((v => v.id === +req.params.id)) //looking for index of video to delete

    //if id doesn't exist throw status 404 and get out of the function
    if(index === -1) {
        res.sendStatus(404);
        return;
    }
    //delete the object and return status 204
    videos_db.splice(index, 1);
    res.sendStatus(204);
})

videosRouter.post('/', (req: Request, res: Response) => {
    //if error send the errorMessage and get out of the function
    const error = postRequestValidate(req.body);
    if(error.errorsMessages.length > 0) {
        res.status(400).json(error)
        return;
    }

    //required values from the body request
    const title = req.body.title;
    const author = req.body.author;
    const resolutions = req.body.availableResolutions;

    //block with default data to pass in the created object
    let createdDate = new Date().toISOString();
    let publicateDate;
    let allowDownload = false;
    let ageRestriction = null;

    const id: number = videos_db.reduce((acc: number, v: VideoType) => acc < v.id
        ? acc = v.id
        : acc, 0) + 1;

    //if properties have been passed in body request reassign the default value for the object
    if(req.body.createdAt) {
        createdDate = req.body.createdAt
    }
    if(req.body.publicationDate) {
        publicateDate = req.body.publicationDate
    }
    else {
        publicateDate = new Date(new Date(createdDate).setDate(new Date(createdDate).getDate() + 1)).toISOString(); //+1 day
    }
    if(req.body.canBeDownloaded) {
        allowDownload = req.body.canBeDownloaded
    }
    if(req.body.minAgeRestriction) {
        ageRestriction = req.body.minAgeRestriction
    }

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

    videos_db.push(toCreate);
    res.status(201).json(toCreate);
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    let video = videos_db.find(v => v.id === +req.params.id);
    if(!video) {
        res.sendStatus(404);
        return;
    }

    //if error send the errorMessage and get out of the function
    const error = putRequestValidate(req.body);
    if(error.errorsMessages.length > 0) {
        res.status(400).json(error);
        return;
    }

    //blocks to update properties of the updated object
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