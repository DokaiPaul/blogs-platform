// @ts-ignore
import request from "supertest";
import {app} from "../src/settings";
import {BlogsType} from "../src/types/blogs-types";
import {PostsType} from "../src/types/posts-types";

describe('/posts', () => {
    let blog: BlogsType;
    let post: PostsType;
    beforeAll(async  () => {
        await request(app).delete('/testing/all-data').expect(204);
        const responce = await request(app)
            .post('/blogs')
            .send({
                name: 'Jest tests',
                description: 'Some description',
                websiteUrl: 'https://samurai.it-incubator.io'
            })
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
        blog = responce.body
    });

    it('GET all posts', async () => {
        await request(app).get('/posts').expect(200, [])
    });

    //add tests after API development is done
    it(`shouldn't create post with correct data but without authorization`, async () => {
        await request(app)
            .post('/posts')
            .send({
                title: "e2e tests",
                shortDescription: 'This post has been sent by e2e tests',
                content: 'longread about anythibg',
                blogId: blog.id,
            })
            .expect(401)

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post with title that is not string`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: false,
                shortDescription: 'This post has been sent by e2e tests',
                content: 'longread about anythibg',
                blogId: blog.id,
            })
            .expect(400, {errorsMessages: [{
                    message: 'Title should be a string',
                    field: 'title'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post with empty title`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: '',
                shortDescription: 'This post has been sent by e2e tests',
                content: 'longread about anythibg',
                blogId: blog.id,
            })
            .expect(400, {errorsMessages: [{
                    message: 'Title should be not longer than 30 symbols',
                    field: 'title'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post with title that longer than 30 symbols`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: '1345678912345678913245678913456789',
                shortDescription: 'This post has been sent by e2e tests',
                content: 'longread about anythibg',
                blogId: blog.id,
            })
            .expect(400, {errorsMessages: [{
                    message: 'Title should be not longer than 30 symbols',
                    field: 'title'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post with shortDecription that is not a string`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'e2e tests',
                shortDescription: 5,
                content: 'longread about anythibg',
                blogId: blog.id,
            })
            .expect(400, {errorsMessages: [{
                    message: 'Description should be a string',
                    field: 'shortDescription'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post with empty shortDecription`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'e2e tests',
                shortDescription: '             ',
                content: 'longread about anythibg',
                blogId: blog.id,
            })
            .expect(400, {errorsMessages: [{
                    message: 'Description should be not longer than 100 symbols',
                    field: 'shortDescription'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post with shortDecription that is longer than 100 symbols`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'e2e tests',
                shortDescription: '134567891232132132123123123456464321kl;,nljkvjvbhjkvgbjk3467891324678912345678913465798134657894134678913467981345678913465789134567891354654987',
                content: 'longread about anythibg',
                blogId: blog.id,
            })
            .expect(400, {errorsMessages: [{
                    message: 'Description should be not longer than 100 symbols',
                    field: 'shortDescription'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post if content is not a string`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'e2e tests',
                shortDescription: 'created by e2e tests',
                content: [],
                blogId: blog.id,
            })
            .expect(400, {errorsMessages: [{
                    message: 'Content should be a string',
                    field: 'content'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post with empty content`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'e2e tests',
                shortDescription: 'created by e2e tests',
                content: '    ',
                blogId: blog.id,
            })
            .expect(400, {errorsMessages: [{
                    message: 'Content should be not longer than 1000 symbols',
                    field: 'content'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post if blogId is not string`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'e2e tests',
                shortDescription: 'created by e2e tests',
                content: 'blablabla',
                blogId: 21458,
            })
            .expect(400, {errorsMessages: [{
                    message: 'Blog ID should be a string',
                    field: 'blogId'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`shouldn't create post if blogId doesn't exist in blogs_db`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'e2e tests',
                shortDescription: 'created by e2e tests',
                content: 'blablabla',
                blogId: blog.id + 'random124',
            })
            .expect(400, {errorsMessages: [{
                    message: 'This blogs ID does not exists',
                    field: 'blogId'
                }]})

        await request(app).get('/posts').expect(200, [])
    });

    it(`should create post with correct data`, async () => {
        const response = await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'e2e tests',
                shortDescription: 'created by e2e tests',
                content: 'blablabla',
                blogId: blog.id
            })
            .expect(201)

        post = response.body

        expect(post).toEqual({
            id: post.id,
            title: 'e2e tests',
            shortDescription: 'created by e2e tests',
            content: 'blablabla',
            blogId: blog.id,
            blogName: post.blogName
        })

        const get = await request(app).get('/posts').expect(200)

        expect(get.body).toEqual([post])
    });

    it(`shouldn't update post without authorization`, async () => {
        const response = await request(app)
            .put('/posts/'+post.id)
            .send({
                title: 'updated post',
                shortDescription: 'updated by e2e tests',
                content: 'blablabla',
                blogId: blog.id
            })
            .expect(401)

        const get = await request(app).get('/posts').expect(200)

        expect(get.body).toEqual([post])
    });

    it(`shouldn't update post by incorrect id`, async () => {
        const response = await request(app)
            .put('/posts/'+post.id+'random')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'updated post',
                shortDescription: 'updated by e2e tests',
                content: 'blablabla',
                blogId: blog.id
            })
            .expect(404)

        const get = await request(app).get('/posts').expect(200)

        expect(get.body).toEqual([post])
    });

    it(`should update post with correct data`, async () => {
        const response = await request(app)
            .put('/posts/'+post.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'updated post',
                shortDescription: 'updated by e2e tests',
                content: 'blablabla',
                blogId: blog.id
            })
            .expect(204)

        const get = await request(app).get('/posts').expect(200)
        post = get.body[0]
        expect(post).toEqual({
            id: expect.any(String),
            title: 'updated post',
            shortDescription: 'updated by e2e tests',
            content: 'blablabla',
            blogId: blog.id,
            blogName: 'Jest tests'
        })
    });

    it(`shouldn't delete without authorization`, async () => {
        await request(app)
            .delete('/posts/'+post.id)
            .expect(401)

        const get = await request(app).get('/posts').expect(200)

        expect(get.body).toEqual([post])
    })

    it(`shouldn't delete by incorrect id`, async () => {
        await request(app)
            .delete('/posts/'+post.id+'random')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

        const get = await request(app).get('/posts').expect(200)

        expect(get.body).toEqual([post])
    })

    it(`should delete post`, async () => {
        await request(app)
            .delete('/posts/'+post.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        const get = await request(app).get('/posts').expect(200)

        expect(get.body).toEqual([])
    })
})
