import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceModule } from 'src/service/service.module';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { Action, ActionSchema } from './schemas/action.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Action.name, schema: ActionSchema }]),
    forwardRef(() => ServiceModule)
  ],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService]
})
export class ActionModule {}
