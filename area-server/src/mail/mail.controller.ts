import {Controller, Post, Param, Delete} from '@nestjs/common';
import { MailService } from './mail.service';
import {Area} from "../area/schemas/area.schema";

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async create(area: Area) {
    return this.mailService.create(area);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailService.remove(+id);
  }
}