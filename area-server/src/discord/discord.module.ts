import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DiscordService } from './discord.service';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
