import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { Request } from 'express';

function extractJwt(req: Request) : string | null {
  if (req.headers.token)
    return req.headers.token.toString();
  else if (req.params.token)
    return req.params.token.toString();
  else if (req.query.token)
    return req.query.token.toString();
  else return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractJwt,
      ignoreExpiration: true, // TODO : vérifier si false est adapté
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
