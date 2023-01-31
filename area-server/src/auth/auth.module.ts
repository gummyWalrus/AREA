import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { GoogleOauthStrategy } from './google/google-oauth.strategy';
import { GithubOauthStrategy } from './github/github-oauth.strategy';
import { HttpModule } from '@nestjs/axios';
import { MyTwitterOauthStrategy } from './twitter/mytwitter-oauth.strategy';
import { ServiceModule } from 'src/service/service.module';
import { DiscordStrategy } from './discord/discord-strategy';
import { DiscordOauthStrategy } from './discord/discord-oauth.strategy';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => UserModule),
    PassportModule,
    forwardRef(() => ServiceModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleOauthStrategy,
    GithubOauthStrategy,
    MyTwitterOauthStrategy,
    DiscordOauthStrategy,
    DiscordStrategy,
  ],
  exports: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    MyTwitterOauthStrategy,
    DiscordStrategy,
  ],
})
export class AuthModule {}
