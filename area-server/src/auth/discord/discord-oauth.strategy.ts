import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { HttpService } from '@nestjs/axios';
import * as Chance from 'chance';

const chance = new Chance();

@Injectable()
export class DiscordOauthStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
    private readonly httpService: HttpService
    ) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>('DISCORD_CLIENT_ID'),
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.get<string>('DISCORD_REDIRECT_URL'),
      authorizationURL: 'https://discord.com/api/oauth2/authorize?permissions=8',
      scopeSeparator: ' ',
      scope: ['identify', 'email', 'guilds', 'bot']
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    return {
      firstname: `${profile.username}#${profile.discriminator}`,
      lastname: "Discord",
      email: profile.email,
      password: chance.string({ length: 10 }),
      discord: {
        token: _refreshToken,
        username: `${profile.username}#${profile.discriminator}`,
        id: profile.id,
      }
    };
  }
}