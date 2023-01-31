import {Controller, Post} from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import {Area} from "../area/schemas/area.schema";

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post()
  async upload(area: Area) {
      return this.youtubeService.upload(area);
  }
}
