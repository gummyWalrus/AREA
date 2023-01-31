import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('about.json')
  async getAboutJson(@Req() req : Request): Promise<string> {
    const str = JSON.stringify(await this.appService.getAboutJson(req.ip), null, 4);
    return str;
  }
}
