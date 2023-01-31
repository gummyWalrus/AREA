import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import {Login} from "../interfaces/login.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private user: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // false by default
      secretOrKey: config.get('SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    const user = this.user.findOne(payload.sub);
    user.then((user: Login) => {
        delete user.password;
        return user;
    });
    return user;
  }
}