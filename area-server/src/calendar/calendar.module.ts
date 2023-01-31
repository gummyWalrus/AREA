import {forwardRef, Module} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import {UserModule} from "../user/user.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule,
    forwardRef(() => UserModule)],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService]
})
export class CalendarModule {}
