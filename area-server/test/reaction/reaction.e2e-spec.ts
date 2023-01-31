import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { generateReactionInput } from './create.reaction.help';
import { AppModule } from 'src/app.module';
const axios = require('axios')

describe('Reaction Controller (e2e)', () => {
    let app: INestApplication;
    let reaction : any;
    let reactionInput = generateReactionInput().reactionInput;
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

it('Should find all reactions via GET /reactions', () => {
    return getToken().then((token) => {
        return request(app.getHttpServer())
        .get('/reactions')
        .set('token', token)
        .send()
        .expect(200)
        .expect((res) => {
            let gotReactions = res.body;
            expect(gotReactions).toBeDefined();
        })
    })
});

it('Should create a reaction via POST /reactions', () => {
    return request(app.getHttpServer())
    .post('/reactions')
    .set('token', process.env.ADMIN_TOKEN)
    .send(reactionInput)
    .expect(201)
    .expect((res) => {
        expect(res.body).toBeDefined();
        reaction = res.body;
        expect(reaction._id).toBeDefined();
        expect(reaction.name).toBe(reactionInput.name);
        expect(reaction.description).toBe(reactionInput.description);
        expect(reaction.service).toBe(reactionInput.service);
        expect(reaction.dataScheme.properties.test.description).toBe(reactionInput.dataScheme.properties.test.description);
        expect(reaction.dataScheme.properties.test.type).toBe(reactionInput.dataScheme.properties.test.type);
    }
)});

it('Should update a reaction via PUT /reactions/:id', () => {
    return request(app.getHttpServer())
    .put('/reactions/' + reaction._id)
    .set('token', process.env.ADMIN_TOKEN)
    .send(reactionInput)
    .expect(200)
    .expect((res) => {
        expect(res.body).toBeDefined();
        reaction = res.body;
        expect(reaction._id).toBeDefined();
        expect(reaction.name).toBe(reactionInput.name);
        expect(reaction.description).toBe(reactionInput.description);
        expect(reaction.service).toBe(reactionInput.service);
        expect(reaction.dataScheme.properties.test.description).toBe(reactionInput.dataScheme.properties.test.description);
        expect(reaction.dataScheme.properties.test.type).toBe(reactionInput.dataScheme.properties.test.type);
    })
});

it('Should delete a reaction via DELETE /reactions/:id', () => {
    return request(app.getHttpServer())
    .delete('/reactions/' + reaction._id)
    .set('token', process.env.ADMIN_TOKEN)
    .send()
    .expect(200)
    .expect((res) => {
        expect(res.body).toBeDefined();
        reaction = res.body;
        expect(reaction._id).toBeDefined();
        expect(reaction.name).toBe(reactionInput.name);
        expect(reaction.description).toBe(reactionInput.description);
        expect(reaction.service).toBe(reactionInput.service);
        expect(reaction.dataScheme.properties.test.description).toBe(reactionInput.dataScheme.properties.test.description);
        expect(reaction.dataScheme.properties.test.type).toBe(reactionInput.dataScheme.properties.test.type);
    })
});

});