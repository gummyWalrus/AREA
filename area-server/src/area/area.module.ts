import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './schemas/area.schema';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';
import { UserModule } from 'src/user/user.module';
import { ActionModule } from 'src/action/action.module';
import { ReactionModule } from 'src/reaction/reaction.module';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    forwardRef(() => UserModule),
    ActionModule,
    ReactionModule,
    forwardRef(() => GithubModule)
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService]
})
export class AreaModule {}
