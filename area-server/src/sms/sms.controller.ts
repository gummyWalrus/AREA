import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SmsService } from './sms.service';
import {Area} from "../area/schemas/area.schema";

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post()
  create(@Body() area: Area) {
    return this.smsService.sendSMS(area);
  }
  @Get()
  check() {
    return this.smsService.check();
  }
}
