import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { generateActionInput } from '../action/create.action.helper';
import { AppModule } from 'src/app.module';
const axios = require('axios')

describe('Action Controller (e2e)', () => {
    let app: INestApplication;
    let action : any;
    let actionInput = generateActionInput().actionInput;
    let token : string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
});

async function getToken() : Promise<string> {
    return await axios.post('http://localhost:8080/auth/login', {email: "test@example.com", password: "test"})
    .then((res)=> {
      return res.data.token;
    }).catch((err) => {
      console.error(err)
      return '';
    })
}

it('Should find all actions via GET /actions', () => {
    return getToken().then((token) => {
        return request(app.getHttpServer())
        .get('/actions')
        .set('token', token)
        .send()
        .expect(200)
        .expect((res) => {
            let gotActions = res.body;
            expect(gotActions).toBeDefined();
        })
    })
});

it('Should create a action via POST /actions', () => {
    return request(app.getHttpServer())
    .post('/actions')
    .set('token', process.env.ADMIN_TOKEN)
    .send(actionInput)
    .expect(201)
    .expect((res) => {
        expect(res.body).toBeDefined();
        action = res.body;
        expect(action._id).toBeDefined();
        expect(action.name).toBe(actionInput.name);
        expect(action.description).toBe(actionInput.description);
        expect(action.service).toBe(actionInput.service);
        expect(action.dataScheme.properties.test.description).toBe(actionInput.dataScheme.properties.test.description);
        expect(action.dataScheme.properties.test.type).toBe(actionInput.dataScheme.properties.test.type);
    }
)});

it('Should update a action via PUT /actions/:id', () => {
    return request(app.getHttpServer())
    .put('/actions/' + action._id)
    .set('token', process.env.ADMIN_TOKEN)
    .send(actionInput)
    .expect(200)
    .expect((res) => {
        expect(res.body).toBeDefined();
        action = res.body;
        expect(action._id).toBeDefined();
        expect(action.name).toBe(actionInput.name);
        expect(action.description).toBe(actionInput.description);
        expect(action.service).toBe(actionInput.service);
        expect(action.dataScheme.properties.test.description).toBe(actionInput.dataScheme.properties.test.description);
        expect(action.dataScheme.properties.test.type).toBe(actionInput.dataScheme.properties.test.type);
    })
});

it('Should delete a action via DELETE /actions/:id', () => {
    return request(app.getHttpServer())
    .delete('/actions/' + action._id)
    .set('token', process.env.ADMIN_TOKEN)
    .send()
    .expect(200)
    .expect((res) => {
        expect(res.body).toBeDefined();
        action = res.body;
        expect(action._id).toBeDefined();
        expect(action.name).toBe(actionInput.name);
        expect(action.description).toBe(actionInput.description);
        expect(action.service).toBe(actionInput.service);
        expect(action.dataScheme.properties.test.description).toBe(actionInput.dataScheme.properties.test.description);
        expect(action.dataScheme.properties.test.type).toBe(actionInput.dataScheme.properties.test.type);
    })
});

});