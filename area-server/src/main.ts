import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use((req, res, next) => {
    console.log("request headers", req.headers);
    console.log("request path", req.url);
    if (!req.headers['user-agent'])
      req.headers.platform = 'unknown';
    else if (req.headers['user-agent'].includes('Windows') || req.headers['user-agent'].includes('Linux'))
      req.headers.platform = 'web';
    else if (req.headers['user-agent'].includes('iPhone') || req.headers['user-agent'].includes('Android'))
      req.headers.platform = 'mobile';
    else req.headers['user-agent'] = 'unknown';
    next();
  })
  app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  }))
  app.use(cookieParser());
  await app.listen(8080);
  console.log("app listening on port 8080");
}
bootstrap();