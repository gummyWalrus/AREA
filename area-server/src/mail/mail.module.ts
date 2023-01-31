import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import {ConfigModule} from "@nestjs/config";
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule,
  forwardRef(() => UserModule)],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
