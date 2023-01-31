import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (typeof user === 'object')
        return user;
    else if (user === 401)
      throw new UnauthorizedException();
    else if (user === 404)
        throw new NotFoundException();
    else if (user === 500)
        throw new InternalServerErrorException();
  }
}
