import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { Service } from 'src/service/interfaces/service.interface';
import { UserService } from 'src/user/user.service';
import { generateServiceInput } from './create.service.helper';

const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Service Controller (e2e)', () => {
  let app: INestApplication;
  let service : Service;
  let serviceInput = generateServiceInput().serviceInput;
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


  it('Should find all services via GET /services', () => {
    return getToken().then((token) => {
      return request(app.getHttpServer())
      .get('/services')
      .set('token', token)
      .send()
      .expect(200)
      .expect((res) => {
        let gotServices = res.body;
        expect(gotServices).toBeDefined();
      })
    })
  });

  it('Should create a service via POST /service', () => {
    return request(app.getHttpServer())
    .post('/services')
    .set('token', process.env.ADMIN_TOKEN)
    .send(serviceInput)
    .expect(201)
    .expect((res) => {
      expect(res.body).toBeDefined();
      service = res.body;
      expect(service._id).toBeDefined();
      expect(service.name).toBe(serviceInput.name);
      expect(service.logo).toBe(serviceInput.logo);
    })
  });

  it('Should update a service via PUT /service/:id', () => {
    return request(app.getHttpServer())
    .put('/services/' + service._id)
    .set('token', process.env.ADMIN_TOKEN)
    .send(serviceInput)
    .expect(200)
    .expect((res) => {
      expect(res.body).toBeDefined();
      service = res.body;
      expect(service._id).toBeDefined();
      expect(service.name).toBe(serviceInput.name);
      expect(service.logo).toBe(serviceInput.logo);
    })
  });

  it('Should delete a service via DELETE /service/:id', () => {
    return request(app.getHttpServer())
    .delete('/services/' + service._id)
    .set('token', process.env.ADMIN_TOKEN)
    .send()
    .expect(200)
    .expect((res) => {
      expect(res.body).toBeDefined();
      service = res.body;
      expect(service._id).toBeDefined();
      expect(service.name).toBe(serviceInput.name);
      expect(service.logo).toBe(serviceInput.logo);
    })
  });

  

});
