import {Controller, Post} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {Area} from "../area/schemas/area.schema";

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  async create(area: Area) {
    return this.calendarService.create(area);
  }
}
