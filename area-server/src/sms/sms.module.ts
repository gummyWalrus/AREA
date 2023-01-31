import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { TwilioModule } from "nestjs-twilio";
require('dotenv').config();

@Module({
    imports: [TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    })],
  controllers: [SmsController],
  providers: [SmsService],
    exports: [SmsService]
})
export class SmsModule {}
