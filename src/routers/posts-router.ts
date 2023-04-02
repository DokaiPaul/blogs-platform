import {Router, Response, Request} from "express";
import {posts_db} from "../database/posts-db";
import {blogs_db} from "../database/blogs-db";
import request from "supertest";
import {resolve} from "dns";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {postBodyValidationMiddleware} from "../middlewares/blog-body-validation-middleware";
import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {blogsRouter} from "./blogs-router";

export const postsRouter = Router({});

postsRouter.get('/', (req: Request, res: Response) => {
    res.send(posts_db);
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const post = posts_db.find(v => v.id === req.params.id);
    if(!post) {
        res.sendStatus(404);
        return;
    }
    res.send(post);
})

postsRouter.use(authorizationMiddleware);
postsRouter.post('/',postBodyValidationMiddleware ,inputValidationMiddleware, (req: Request, res: Response) => {
    const newPost = postsRepository.createRepository(req.body)
    res.status(201).json(newPost)
})

postsRouter.put('/:id', postBodyValidationMiddleware ,inputValidationMiddleware,(req: Request, res: Response) => {
    let post = posts_db.find(v => v.id === req.params.id);
    if(!post) {
        res.sendStatus(404);
        return;
    }
    postsRepository.updateRepository(post ,req.body)
    res.sendStatus(204)
})

postsRouter.delete('/:id', inputValidationMiddleware, (req: Request, res: Response) => {
    const index = posts_db.findIndex(b => b.id === req.params.id)

    if(index === -1) {
        res.sendStatus(404);
        return;
    }
    posts_db.splice(index, 1);
    res.sendStatus(204);
})