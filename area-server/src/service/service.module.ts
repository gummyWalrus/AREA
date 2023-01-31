import { Module, forwardRef } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './schemas/service.schema';
import { ReactionModule } from 'src/reaction/reaction.module';
import { ActionModule } from 'src/action/action.module';
import { AuthModule } from 'src/auth/auth.module';
import { DiscordModule } from 'src/discord/discord.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    forwardRef(() => ReactionModule),
    forwardRef(() => ActionModule),
    forwardRef(() => AuthModule),
    forwardRef(() => DiscordModule),

  ],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [ServiceService]
})
export class ServiceModule {
}
