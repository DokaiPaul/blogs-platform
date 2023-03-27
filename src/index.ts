import express, {Request, Response} from "express";
import bodyParser from "body-parser";

const app = express();

const port = 3000;

let db = [
    {
        id: 0,
        title: 'How I learn Back-end',
        author: 'Pavlo Dokai',
        canBeDownLoaded: true,
        minAgeRestriction: null,
        createdAt: "2023-03-27T20:17:51:59.1247",
        publicationDate: "2023-03-28T20:17:51:59.1247",
        availableResolutions: ["P720"]
    },
    {
        id: 1,
        title: 'My progress in learning',
        author: 'Pavlo Dokai',
        canBeDownLoaded: false,
        minAgeRestriction: null,
        createdAt: "2023-03-28T20:17:51:59.1247",
        publicationDate: "2023-03-29T20:17:51:59.1247",
        availableResolutions: ["P720"]
    },
    {
        id: 2,
        title: `I've bought new camera. Check it out`,
        author: 'Pavlo Dokai',
        canBeDownLoaded: false,
        minAgeRestriction: null,
        createdAt: "2023-03-30T20:17:51:59.1247",
        publicationDate: "2023-03-31T20:17:51:59.1247",
        availableResolutions: ["P720","P2160"]
    }
];

const parserMiddlware = bodyParser();
app.use(parserMiddlware);

app.get('/videos', (req: Request, res: Response) => {
    res.send(db);
})

app.get('/videos/:id', (req: Request, res: Response) => {
    let video = db.find(v => v.id === +req.params.id);
    if(video) {
        res.send(video);
    }
    else {
        res.send(404);
    }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    for(let i = 0; i < db.length; i++) {
        if(db[i].id === +req.params.id) {
            db.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(204);
})

app.post('/videos', (req: Request, res: Response) => {
    const title = req.body.title;
    const author = req.body.author;
    if(title && author) {
        const errorMsg = {
            "errorsMessages": [
                {
                    "message": "",
                    "field": ""
                }
            ]
        }
        if(title.length > 40) {
            errorMsg.errorsMessages[0].message = "Title's length is longer than 40 symbols";
            errorMsg.errorsMessages[0].field = "Title has an error";

            res.sendStatus(400).send(errorMsg);
            return;
        }
        else if(author.length > 20) {
            errorMsg.errorsMessages[0].message = "Author name's length is longer than 20 symbols";
            errorMsg.errorsMessages[0].field = "Author has an error";

            res.sendStatus(400).send(errorMsg);
            return;
        }
        let id = db.length + 1;
        const day = new Date().getDate();
        let currentDate = new Date().toISOString();
        let uploadedDate = new Date(new Date(currentDate).setDate(day + 1)).toISOString(); //used when user did not specify the uploaded in the body

        let toCreate = {
            id: id,
            title: title,
            author: author,
            canBeDownLoaded: false,
            minAgeRestriction: null,
            createdAt: currentDate,
            publicationDate: uploadedDate,
            availableResolutions: []
        };

        db.push(toCreate);
        res.sendStatus(201).send(toCreate);
        return;
    }
    res.send(400);
})

app.listen(port, () => {
    // console.log(`App has been launched on port ${port}`);
    console.log(db)
})