import {forwardRef, Module} from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import {ConfigModule} from "@nestjs/config";
import {UserModule} from "../user/user.module";

@Module({
  imports: [ConfigModule,
    forwardRef(() => UserModule)],
  controllers: [YoutubeController],
  providers: [YoutubeService],
  exports: [YoutubeService]
})
export class YoutubeModule {}
