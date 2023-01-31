import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AdminTokenMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService) {}

  use(req: any, res: any, next: () => void) {
    if (!req.headers.token) {
      res.statusCode = 401;
      res.send('Unauthorized : Missing admin token');
    } else {
      if (req.headers.token === this.config.get('ADMIN_TOKEN'))
        next();
      else {
        res.statusCode = 401;
        res.send('Unauthorized : Invalid admin token');
      }
    }
  }
}
