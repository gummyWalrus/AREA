import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Octokit } from 'octokit';
import * as Chance from 'chance';

const chance = new Chance();

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService
    ) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>('OAUTH_GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('OAUTH_GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GITHUB_REDIRECT_URL'),
      scope: ['public_profile', 'user', 'repo']
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const octokit = new Octokit({
      auth: _accessToken
    })

    const email = await octokit.request('GET /user/emails');
    console.log("profile====: ", profile);
    // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    return {
      firstname: profile.displayName,
      lastname: "Github",
      email: email.data[0].email,
      password: chance.string({length: 10}),
      github: {
        token: _accessToken,
        username: profile.username
      }
    };
  }
}