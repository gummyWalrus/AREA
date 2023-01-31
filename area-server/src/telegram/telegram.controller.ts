import {Controller, Post} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import {Area} from "../area/schemas/area.schema";

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async sensSMS(area: Area) {
    return this.telegramService.sendSMS(area);
  }
}
