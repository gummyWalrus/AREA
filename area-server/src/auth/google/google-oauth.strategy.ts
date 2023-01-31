import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import * as Chance from 'chance';

const chance = new Chance();

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>('OAUTH_GOOGLE_ID'),
      clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile', 'https://mail.google.com/', 'openid',
        'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.upload'],
      access_type: 'offline'
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { id, name, emails } = profile;
    return {
      firstname: name.givenName || "Google",
      lastname: name.familyName || name.givenName || "Google",
      email: emails[0].value,
      password: chance.string({ length: 10 }),
      google: {
        token: _refreshToken,
        username: `${name.givenName} ${name.familyName}`,
        email: emails[0].value
      }
    };
  }
}