import { Controller, Get, Request, Post, UseGuards, NotFoundException, Res, Redirect, Head } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import LocalAuthGuard from './local/local-auth.guard';
import GoogleOauthGuard from './google/google-auth.guard';
import GithubOauthGuard from './github/github-auth.guard';
import DiscordOauthGuard from './discord/discord-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { MyTwitterOauthStrategy } from './twitter/mytwitter-oauth.strategy';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { DiscordStrategy } from './discord/discord-strategy';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly mytwitter: MyTwitterOauthStrategy,
    private readonly discordStrategy: DiscordStrategy)
  {
  }

  redirectAfterSignIn(@Request() req, token : { token : string}) {
    if (req.headers.platform === "web")
      return {url : `${this.config.get('FRONT_URL')}/#redirect?token=${token.token}`};
    else if (req.headers.platform === 'mobile')
      return {url : 'area-halouf://redirect' + `?token=${token.token}`};
    else return {url : `${this.config.get('FRONT_URL')}/#redirect?token=${token.token}`};
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const token = await this.authService.login(req.user);
    return {...token, ...req.user};
  }

  @Get('google')
  @Redirect()
  async google(@Request() req) {
    if (req.query.token) {
      let payload = jwt.decode(req.query.token);
      this.userService.update(payload.sub.toString(), {google: {token: "fetching"}})
      return {url : "/auth/google/authorize"}
    } else return {url : "/auth/google/authorize"}
  }

  @Get('google/authorize')
  @UseGuards(GoogleOauthGuard)
  async redirectToAuthGoogle(@Request() req : Request) {

  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleRedirect(@Request() req, @Res() res) {
    const existingUser = await this.userService.all().then(async (users) => {
      for (const user of users) {
        if (user.google && user.google.token === "fetching") {
          return this.authService.login(await this.userService.update(user._id, {google: req.user.google}));
        }
      }
      return null;
    })
    if (existingUser != null)
      res.redirect(this.redirectAfterSignIn(req, existingUser).url);
    else {
      const loggingUser = await  this.userService.findByGoogleEmail(req.user.google.email).then(async (users) => {
        if (users.length > 0) {
          return this.authService.login(await this.userService.update(users[0]._id, {google: req.user.google}));
        } else return null;
      })
      if (loggingUser != null)
        res.redirect(this.redirectAfterSignIn(req, loggingUser).url);
      else {
        res.redirect(this.redirectAfterSignIn(req, await this.authService.login(await this.userService.create(req.user))).url);
      }
    }
  }


  @Get('github/authorize')
  @UseGuards(GithubOauthGuard)
  async redirectToAuthGithub(@Request() req) {

  }

  @Get('github')
  @Redirect()
  async github(@Request() req) {
    if (req.query.token) {
      let payload = jwt.decode(req.query.token);
      this.userService.update(payload.sub.toString(), {github: {token: "fetching"}})
      return {url : "/auth/github/authorize"}
    } else return {url : "/auth/github/authorize"}
  }

  @Get('github/redirect')
  @UseGuards(GithubOauthGuard)
  async githubRedirect(@Request() req, @Res() res) {
    const existingUser = await this.userService.all().then(async (users) => {
      for (const user of users) {
        if (user.github && user.github.token === "fetching") {
          return this.authService.login(await this.userService.update(user._id, {github: req.user.github}));
        }
      }
      return null;
    })
    if (existingUser != null)
      res.redirect(this.redirectAfterSignIn(req, existingUser).url);
    else {
      const loggingUser = await  this.userService.findByGithubUsername(req.user.github.username).then(async (users) => {
        if (users.length > 0) {
          return this.authService.login(await this.userService.update(users[0]._id, {github: req.user.github}));
        } else return null;
      })
      if (loggingUser != null)
        res.redirect(this.redirectAfterSignIn(req, loggingUser).url);
      else {
        res.redirect(this.redirectAfterSignIn(req, await this.authService.login(await this.userService.create(req.user))).url);
      }
    }
  }

 
  @Get('discord/authorize')
  @UseGuards(DiscordOauthGuard)
  async redirectToAuthDiscord(@Request() res) {
  }

  @Get('discord')
  @Redirect()
  async discord(@Request() req) {
    if (req.query.token) {
      let payload = jwt.decode(req.query.token);
      this.userService.update(payload.sub.toString(), {discord: {token: "fetching"}})
      return {url : "/auth/discord/authorize"}
    } else return {url : "/auth/discord/authorize"}
  }

  @Head('discord/redirect')
  async discordHead()
  {
    return {"msg" : "gimme Head"}
  }

  @Get('discord/redirect')
  @UseGuards(DiscordOauthGuard)
  async discordRedirect(@Request() req, @Res() res) {
    const loggingUser = await this.userService.findByDiscordUsername(req.user.discord.username).then(async (users) => {
      if (users.length > 0) {
        return await this.authService.login(await this.userService.update(users[0]._id, {discord: req.user.discord}));
      } else return null;
    })
    if (loggingUser != null) {
      res.redirect(this.redirectAfterSignIn(req, loggingUser).url);
    } else {
      const existingUser = await this.userService.all().then(async (users) => {
        for (const user of users) {
          if (user.discord && user.discord.token === "fetching") {
            return await this.authService.login(await this.userService.update(user._id, {discord: req.user.discord}));
          }
        }
        return null;
      })
      if (existingUser != null) {
        res.redirect(this.redirectAfterSignIn(req, existingUser).url);
      } else {
        res.redirect(this.redirectAfterSignIn(req, await this.authService.login(await this.userService.create(req.user))).url);
      }
    }
  }

  @Get('twitter')
  @UseGuards(JwtAuthGuard)
  async twitter(@Request() req, @Res() res: Response) {
    const redirect = await this.mytwitter.redirect(req);
    res.redirect(redirect.url);
  }

  @Get('twitter/redirect')
  async twitterRedirect(@Request() req, @Res() res) {
    const twitter_token = await this.mytwitter.handleRedirect(req);
    return await this.userService.findByEmail(req.query.state).then(async (users) => {
      if (users.length > 0) {
        const loginUser = await this.authService.login(await this.userService.update(users[0]._id, {twitter: {token: twitter_token.token}}));
        res.redirect(this.redirectAfterSignIn(req, loginUser).url);
      } else throw new NotFoundException();
    })
  }

  @Get('services')
  @UseGuards(JwtAuthGuard)
  loggedInServices(@Request() req) {
    return this.authService.loggedInServices(req.user);
  }
}