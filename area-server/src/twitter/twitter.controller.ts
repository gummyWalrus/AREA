import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { CreateTwitterDto } from './dto/create-twitter.dto';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Post()
  async create(@Body() createTwitterDto: CreateTwitterDto) {
    return this.twitterService.create(createTwitterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.twitterService.remove(id);
  }
}
