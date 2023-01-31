import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DiscordStrategy {

  public clientID;
  public clientSecret;
  public callbackURL;
  public scopeSeparator;
  public scope;

  constructor(
    configService: ConfigService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService, 
    private readonly httpService: HttpService
    ) {
      this.clientID = configService.get<string>('DISCORD_CLIENT_ID')
      this.clientSecret = configService.get<string>('DISCORD_CLIENT_SECRET')
      this.callbackURL = configService.get<string>('DISCORD_REDIRECT_URL')
      this.scopeSeparator = ' '
      this.scope = ['identify', 'email', 'guilds']
  }

  serializeScopes() {
    return encodeURIComponent(this.scope.join(this.scopeSeparator))
  }

  generateAuthURL() {
    return `https://discord.com/oauth2/authorize?client_id=${this.clientID}&response_type=code&scope=${this.serializeScopes()}&redirect_uri=${encodeURIComponent(this.callbackURL)}&prompt=consent&state=state`;
  }

  async refreshAccessToken(user_id: string) {
    const user = await this.userService.findOne(user_id);
    return await this.httpService.axiosRef.post('https://discord.com/api/oauth2/token',
    `client_id=${this.clientID}&client_secret=${this.clientSecret}&refresh_token=${user.discord.token}&grant_type=refresh_token`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded'} })
    .then((res) => {
      this.userService.update(user_id, {discord: {token : res.data.refresh_token}});
      return res.data.access_token;
    }).catch(console.error);
  }

  async getProfile(accessToken : string) {
    return this.httpService.axiosRef.get('https://discord.com/api/users/@me',
    {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then((res) => {
      return res.data;
    }).catch(console.error);
  }
}