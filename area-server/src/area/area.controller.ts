import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('area')
export class AreaController {
    constructor(private readonly service: AreaService) {}

    @Get()
    async getAll() {
        return await this.service.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.service.findOne(id);
    }

    @Put(':id')
    async putArea(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
        return await this.service.update(id, updateAreaDto);
    }

    @Post()
    async createArea(@Body() createAreaDto: CreateAreaDto, @Req() req) {
        return await this.service.create(req.user.userId, createAreaDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
