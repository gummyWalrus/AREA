import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { User } from 'src/user/interfaces/user.interface';
import { generateUserInput } from './create.user.helper';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var export_token;
module.exports.export_token = export_token;

describe('User Controller (e2e)', () => {
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

  it('Should create a testing user via POST /user/register', () => {
    return request(app.getHttpServer())
    .post('/user/register')
    .send({
      email: "test@example.com",
      lastname: "test",
      firstname: "testeur",
      password: "test"
      })
    .expect((res) => {
      export_token = res.body.token
    })
  })


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

  it('Should find a user via GET /user with proper token', () => {
    return request(app.getHttpServer())
    .get('/user')
    .set('token', token)
    .send()
    .expect(200)
    .expect((res) => {
      let gotUser = res.body;
      expect(gotUser._id).toBeDefined();
      expect(gotUser._id).toBe(user._id);
      expect(gotUser.firstname).toBe(userInput.firstname);
      expect(gotUser.lastname).toBe(userInput.lastname);
      expect(gotUser.email).toBe(userInput.email);
      expect(bcrypt.compareSync(userInput.password, gotUser.password)).toBe(true);
    })
  })

  it('Should successfully update a user via PUT /user with proper token', () => {
    let oldPassword = userInput.password;
    userInput = generateUserInput().userInput;
    return request(app.getHttpServer())
    .put('/user')
    .set('token', token)
    .send(userInput)
    .expect(200)
    .expect((res) => {
      let gotUser = res.body;
      expect(gotUser._id).toBeDefined();
      expect(gotUser._id).toBe(user._id);
      expect(gotUser.firstname).toBe(user.firstname);
      expect(gotUser.lastname).toBe(user.lastname);
      expect(gotUser.email).toBe(user.email);
      expect(bcrypt.compareSync(oldPassword, gotUser.password)).toBe(true);
    })
  })
  it ('Will check that user\'s data have been updated via GET /user with proper token', () => {
    return request(app.getHttpServer())
    .get('/user')
    .set('token', token)
    .send()
    .expect(200)
    .expect((res) => {
      let gotUser = res.body;
      expect(gotUser._id).toBeDefined();
      expect(gotUser._id).toBe(user._id);
      user = gotUser;
      expect(gotUser.firstname).toBe(userInput.firstname);
      expect(gotUser.lastname).toBe(userInput.lastname);
      expect(gotUser.email).toBe(userInput.email);
      expect(bcrypt.compareSync(userInput.password, gotUser.password)).toBe(true);
    })
  })

  it('Should delete a user via DELETE /user with proper token', () => {
    return request(app.getHttpServer())
    .delete('/user')
    .set('token', token)
    .send()
    .expect(200)
    .expect((res) => {
      let gotUser = res.body;
      expect(gotUser._id).toBeDefined();
      expect(gotUser._id).toBe(user._id);
      expect(gotUser.firstname).toBe(userInput.firstname);
      expect(gotUser.lastname).toBe(userInput.lastname);
      expect(gotUser.email).toBe(userInput.email);
      expect(bcrypt.compareSync(userInput.password, gotUser.password)).toBe(true);
    })
  })
});
