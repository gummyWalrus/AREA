import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }]),
    forwardRef(() => ServiceModule)
  ],
  controllers: [ReactionController],
  providers: [ReactionService],
  exports: [ReactionService]
})
export class ReactionModule {}
