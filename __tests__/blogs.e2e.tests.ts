// @ts-ignore
import request from "supertest";
import {app} from "../src/settings";
import exp = require("constants");

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('GET all blogs', async () => {
        await request(app).get('/blogs').expect(200,[])
    });

    it('shouldn\'t create blog without authorisation', async () => {
        await request(app)
            .post('/blogs')
            .send({
                name: 'Jest tests',
                description: 'Some description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .expect(401)

        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('should create new blog', async  () => {
        const response = await request(app)
            .post('/blogs')
            .send({
                name: 'Jest tests',
                description: 'Some description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(201)

        const createdPost = response.body;

        expect(createdPost).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })


})