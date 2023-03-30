// @ts-ignore
import request from 'supertest'
import { app } from '../src/settings'
import {VideoType} from "../src/types/videos-types";

describe('/videos', () => {
    let newVideo: VideoType | null = null

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('GET products = []', async () => {
        await request(app).get('/videos').expect([])
    })

    it('POST does not create the video with incorrect data (no title, no author)', async function () {
        await request(app)
            .post('/videos')
            .send({})
            .expect(400, {
                errorsMessages: [
                    { message: 'An error has been happened', field: 'body' }
                ],
            })

        const res = await request(app).get('/videos')
        expect(res.body).toEqual([])
    })

    it('GET video by ID with incorrect id', async () => {
        await request(app).get('/videos/helloWorld').expect(404)
    })

    it('POST video with correct data', async () => {
        await request(app)
            .post('/videos')
            .send({
                title: "Create by tests",
                author: 'e2e.tests',
                createdAt: '2023-03-30T15:15:34.092Z',
                availableResolutions: ['P144', 'P2160']

            })
            .expect(201, {
                id: 1,
                title: 'Create by tests',
                author: 'e2e.tests',
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: '2023-03-30T15:15:34.092Z',
                publicationDate: '2023-03-31T15:15:34.092Z',
                availableResolutions: [ 'P144', 'P2160' ]
            })
    })

    it('GET video by ID with correct id', async () => {
        await request(app)
            .get('/videos/1')
            .expect(200, {
                id: 1,
                title: 'Create by tests',
                author: 'e2e.tests',
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: '2023-03-30T15:15:34.092Z',
                publicationDate: '2023-03-31T15:15:34.092Z',
                availableResolutions: [ 'P144', 'P2160' ]
            })
    })

    it('PUT video by ID with incorrect data', async () => {
        await request(app)
            .put('/videos' + 1223)
            .send({ title: 'title', author: 'title' })
            .expect(404)

        const res = await request(app).get('/videos')
        expect(res.body[0])
    })

    it('PUT video by ID with correct data', async () => {
        await request(app)
            .put('/videos/1')
            .send({
                title: 'hello title',
                author: 'hello author',
                publicationDate: '2023-01-12T08:12:39.261Z',
            })
            .expect(204)
    })

    it('DELETE video by incorrect ID', async () => {
        await request(app)
            .delete('/videos/876328')
            .expect(404)
    })

    it('DELETE video by correct ID', async () => {
        await request(app)
            .delete('/videos/1')
            .expect(204)

        const res = await request(app).get('/videos')
        expect(res.body.length).toBe(0)
    })
})
