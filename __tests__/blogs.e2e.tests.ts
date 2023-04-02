// @ts-ignore
import request from "supertest";
import {app} from "../src/settings";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('GET all blogs', async () => {
        await request(app).get('/blogs').expect(200,[])
    });
    it('Create blog', async () => {
        await request(app)
            .post('/blogs')
            .send({
                name: `Web developer's blog`,
                description: 'Here I tell you all truth about my dev lifestyle and much more',
                websiteUrl: 'https://back-end-is-fun.ua'
            })
            .expect(201, {
                id: '1',
                name: `Web developer's blog`,
                description: 'Here I tell you all truth about my dev lifestyle and much more',
                websiteUrl: 'https://back-end-is-fun.ua'
            })
    });


    it('GET blog by ID', async () => {
        await request(app).get('/blogs/1').expect(200,{

        })
    });


})