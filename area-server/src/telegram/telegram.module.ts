import {forwardRef, Module} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import {ConfigModule} from "@nestjs/config";
import {UserModule} from "../user/user.module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [ConfigModule,
      HttpModule,
    forwardRef(() => UserModule)],
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService]
})
export class TelegramModule {}
