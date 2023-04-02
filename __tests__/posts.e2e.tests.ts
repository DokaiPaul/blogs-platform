// @ts-ignore
import request from "supertest";
import {app} from "../src/settings";

describe('/posts', () => {
    beforeAll(async  () => {
        await request(app).delete('/testing/all-data').expect(204);
    });

    it('GET all posts', async () => {
        await request(app).get('/posts').expect(200, [])
    });

    //add tests after API development is done

})
