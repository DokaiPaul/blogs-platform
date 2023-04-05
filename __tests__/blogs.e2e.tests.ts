// @ts-ignore
import request from "supertest";
import {app} from "../src/settings";
import {BlogsType} from "../src/types/blogs-types";

describe('/blogs', () => {
    let createdPost: BlogsType;
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('GET all blogs', async () => {
        await request(app).get('/blogs').expect(200,[])
    });

    it('shouldn\'t create blog without authorization', async () => {
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

        createdPost = response.body;

        expect(createdPost).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't update blog with incorrect description`, async () => {
        await request(app)
            .put('/blogs/' + createdPost.id)
            .send({
                name: 'UPD by tests',
                descrption: 'Updated description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400, {errorsMessages: [{
                message: 'Description should be not empty',
                field: 'description'
            }]})

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't update blog if description is not a string`, async () => {
        await request(app)
            .put('/blogs/' + createdPost.id)
            .send({
                name: 'UPD by tests',
                description: 150,
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400, {errorsMessages: [{
                message: 'Description should be a string',
                field: 'description'
            }]})

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't update blog if name length is longer than 15 symbols`, async () => {
        await request(app)
            .put('/blogs/' + createdPost.id)
            .send({
                name: '123456789qwertyu',
                description: 'Updated description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400, {errorsMessages: [{
                message: 'Your name should be not empty or longer than 15 symbols',
                field: 'name'
            }]})

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't update blog if name field is empty`, async () => {
        await request(app)
            .put('/blogs/' + createdPost.id)
            .send({
                name: '     ',
                description: 'Updated description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400, {errorsMessages: [{
                message: 'Your name should be not empty or longer than 15 symbols',
                field: 'name'
            }]})

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't update blog if name is not a string`, async () => {
        await request(app)
            .put('/blogs/' + createdPost.id)
            .send({
                name: false,
                description: 'Updated description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400, {errorsMessages: [{
                message: 'Name should be a string',
                field: 'name'
            }]})

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't update blog if website URL is invalid`, async () => {
        await request(app)
            .put('/blogs/' + createdPost.id)
            .send({
                name: '123456789qwerty',
                description: 'Updated description',
                websiteUrl: 'https/samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400, {errorsMessages: [{
                message: 'You have to input valid URL',
                field: 'websiteUrl'
            }]})

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't update blog if website URL is longer than 100 symbols`, async () => {
        await request(app)
            .put('/blogs/' + createdPost.id)
            .send({
                name: '123456789qwer',
                description: 'Updated description',
                websiteUrl: 'https://samurai.it-incubator.io/oklasdfkhjlgadsfkjlbnasdflkjadbsfklhjasdgf/dasfkbdaskflbdasfkbfaskjfbdaskfb/asdf'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400, {errorsMessages: [{
                message: 'Your URL should be not longer than 100 symbols',
                field: 'websiteUrl'
            }]})

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't update blog if blogs id is incorrect`, async () => {
        await request(app)
            .put('/blogs/15')
            .send({
                name: '123456789qwer',
                description: 'Updated description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it('shouldn\'t update blog without authorization', async () => {
        await request(app)
            .put('/blogs/' + createdPost.id)
            .send({
                name: '123456',
                description: 'Updated description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .expect(401)

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: expect.any(String),
            name: 'Jest tests',
            description: 'Some description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it('should update blog with correct data', async () => {
        await request(app)
            .put('/blogs/' + createdPost.id)
            .send({
                name: 'UPD by tests',
                description: 'Updated description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        const response = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(response.body).toEqual({
            id: createdPost.id,
            name: 'UPD by tests',
            description: 'Updated description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't delete blog without autorization`, async () => {
        await request(app)
            .delete('/blogs/' + createdPost.id)
            .expect(401)

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: createdPost.id,
            name: 'UPD by tests',
            description: 'Updated description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`shouldn't delete blog by incorrect id`, async () => {
        await request(app)
            .delete('/blogs/10')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

        const responce = await request(app)
            .get('/blogs/' + createdPost.id)
            .expect(200)

        expect(responce.body).toEqual({
            id: createdPost.id,
            name: 'UPD by tests',
            description: 'Updated description',
            websiteUrl: 'https://samurai.it-incubator.io'
        })
    })

    it(`should delete blog`, async () => {
        await request(app)
            .delete('/blogs/' + createdPost.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        await request(app)
            .get('/blogs')
            .expect(200, [])
    })
})