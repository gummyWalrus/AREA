import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { User } from 'src/user/interfaces/user.interface';
import { generateUserInput } from '../user/create.user.helper';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Auth Controller (e2e)', () => {
    let app: INestApplication;
    let user : User;
    let userInput = generateUserInput().userInput;
    let token : string;
  
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();
    });

    it('Should create an user via POST /user/register', () => {
        return request(app.getHttpServer())
        .post('/user/register')
        .send(userInput)
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          user = res.body.user;
          expect(user._id).toBeDefined();
          expect(user.firstname).toBe(userInput.firstname);
          expect(user.lastname).toBe(userInput.lastname);
          expect(user.email).toBe(userInput.email);
          expect(bcrypt.compareSync(userInput.password, user.password)).toBe(true);
          expect(res.body.token).toBeDefined();
          token = res.body.token;
        })
      })

    it('Should login a user by receiving a token via POST /auth/login with email and password', () => {
        return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userInput.email, password: userInput.password })
        .expect(201)
        .expect((res) => {
        expect(res.body.token).toBeDefined();
        token = res.body.token;
        })
    })

    it('Should not login a user via POST /auth/login with email and wrong password', () => {
        return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userInput.email, password: "motdepassebidon" })
        .expect(401)
        .expect((res) => {
        expect(res.body.token).toBeUndefined();
        })
    })

    it('Should not login a user via POST /auth/login with wrong email and correct password', () => {
        return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: "notanemail", password: userInput.password })
        .expect(404)
        .expect((res) => {
        expect(res.body.token).toBeUndefined();
        })
    })

    it('Should validate a valid token via GET /user with proper token', () => {
        return request(app.getHttpServer())
        .get('/user')
        .set('token', token)
        .expect(200)
    })

    it('Should unvalidate an invalid token via GET /user with wrong token', () => {
        return request(app.getHttpServer())
        .get('/user')
        .set('token', 'wrongtoken')
        .expect(401)
    })

    it('Should refuse to GET /user with no token', () => {
        return request(app.getHttpServer())
        .get('/user')
        .expect(401)
    })
})