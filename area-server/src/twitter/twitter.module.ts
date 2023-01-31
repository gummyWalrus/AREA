import { Module, forwardRef } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, forwardRef(() => UserModule)],
  controllers: [TwitterController],
  providers: [TwitterService],
  exports: [TwitterService]
})
export class TwitterModule {}
