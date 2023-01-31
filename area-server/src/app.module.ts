import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import {SmsModule} from "./sms/sms.module";
import {TwitterModule} from "./twitter/twitter.module";
import { MailModule } from './mail/mail.module';
import { ServiceModule } from './service/service.module';
import { ActionModule } from './action/action.module';
import { ReactionModule } from './reaction/reaction.module';
import { AreaModule } from './area/area.module';
import AdminTokenMiddleware from './admin-token.middleware';
import { ServiceController } from './service/service.controller';
import { ActionController } from './action/action.controller';
import { ReactionController } from './reaction/reaction.controller';
import {GithubModule} from "./github/github.module";
import { MyTwitterOauthStrategy } from './auth/twitter/mytwitter-oauth.strategy';
import { HttpModule } from '@nestjs/axios';
import { AreaHandlerModule } from './area-handler/area-handler.module';
import { CalendarModule } from './calendar/calendar.module';
import { YoutubeModule } from './youtube/youtube.module';
import { TelegramModule } from './telegram/telegram.module';
import { DiscordModule } from './discord/discord.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URL'),
                dbName: configService.get<string>('MONGODB_NAME')
            }),
            inject: [ConfigService],
        }),
        UserModule,
        AuthModule,
        SmsModule,
        TwitterModule,
        MailModule,
        ServiceModule,
        ActionModule,
        ReactionModule,
        AreaModule,
        GithubModule,
        HttpModule,
        AreaHandlerModule,
        CalendarModule,
        YoutubeModule,
        TelegramModule,
        DiscordModule,
    ],
    controllers: [
        AppController,
    ],
    providers: [
        AppService,
        MyTwitterOauthStrategy
    ],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AdminTokenMiddleware)
        .exclude(
            { path: 'services', method: RequestMethod.GET },
            { path: 'actions', method: RequestMethod.GET },
            { path: 'reactions', method: RequestMethod.GET },
            { path: 'services/:id', method: RequestMethod.GET },
            { path: 'actions/:id', method: RequestMethod.GET },
            { path: 'reactions/:id', method: RequestMethod.GET }
        )
        .forRoutes(ServiceController, ActionController, ReactionController);
    }
}
