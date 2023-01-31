import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Chance from 'chance';
import { Request } from 'express';
import { auth } from "twitter-api-sdk";
import { Client } from 'twitter-api-sdk';

const chance = new Chance();

@Injectable()
export class MyTwitterOauthStrategy {
  constructor(
    private readonly configService: ConfigService,
  ) {}


    authClient = new auth.OAuth2User({
      client_id: this.configService.get<string>('OAUTH_TWITTER_CLIENT_ID'),
      client_secret: this.configService.get<string>('OAUTH_TWITTER_CLIENT_SECRET'),
      callback: this.configService.get<string>('OAUTH_TWITTER_REDIRECT_URL'),
      scopes: ["tweet.read", "users.read", "offline.access", "tweet.write"],
    });

  
  async redirect(@Req() req : Request) {
    return { url : this.authClient.generateAuthURL({
      state: req.user["email"],
      code_challenge_method: "s256"
    })}
  }

  async handleRedirect(@Req() req : Request) {
    return await this.authClient.requestAccessToken(req.query.code as string)
    .then((tokens) => {
      let client = new Client(this.authClient);
      return client.users.findMyUser().then((user) => {
        return {username: user.data.username, token: tokens.token.refresh_token}
      })
    }).catch((err) => {console.error(err); return null;});
  }
}