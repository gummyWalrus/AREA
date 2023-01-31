import {forwardRef, Module} from '@nestjs/common';
import { AreaHandlerService } from './area-handler.service';
import { TwitterModule } from 'src/twitter/twitter.module';
import { AreaModule } from 'src/area/area.module';
import { ActionModule } from 'src/action/action.module';
import { ServiceModule } from 'src/service/service.module';
import { MailModule } from 'src/mail/mail.module';
import {CalendarModule} from "../calendar/calendar.module";
import {YoutubeModule} from "../youtube/youtube.module";
import {SmsModule} from "../sms/sms.module";
import {TelegramModule} from "../telegram/telegram.module";
import { DiscordModule } from 'src/discord/discord.module';

@Module({
  imports: [
    forwardRef(() => AreaModule),
    ActionModule,
    TwitterModule,
    forwardRef(() => ServiceModule),
    MailModule,
    CalendarModule,
      YoutubeModule,
      SmsModule,
      TelegramModule,
      DiscordModule
  ],
  providers: [AreaHandlerService],
  exports: [AreaHandlerService]
})
export class AreaHandlerModule {}
