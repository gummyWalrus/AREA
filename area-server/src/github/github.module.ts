import { Module, forwardRef } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { AreaModule } from 'src/area/area.module';
import { TwitterModule } from 'src/twitter/twitter.module';
import { UserModule } from 'src/user/user.module';
import { ServiceModule } from 'src/service/service.module';
import {AreaHandlerModule} from "../area-handler/area-handler.module";
import { ActionModule } from 'src/action/action.module';

@Module({
  imports: [forwardRef(() => AreaModule),
    TwitterModule,
    forwardRef(() => UserModule),
    ServiceModule,
    AreaHandlerModule,
    ActionModule
  ],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService]
})
export class GithubModule {}