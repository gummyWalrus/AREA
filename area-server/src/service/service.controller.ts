import { Controller, Get, Param, Put, Body, Delete, Post, UseGuards, Req } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('services')
export class ServiceController {

    constructor(private readonly service : ServiceService) {}

    @Get('actions')
    @UseGuards(JwtAuthGuard)
    async getServicesWithActions(@Req() req) {
        return await this.service.findActionServices(req);
    }

    @Get('reactions')
    @UseGuards(JwtAuthGuard)
    async getServicesWithReactions(@Req() req) {
        return await this.service.findReactionServices(req);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getService(@Req() req, @Param('id') id : string) {
        return await this.service.findOne(id, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return await this.service.findAll();
    }

    @Put(":id")
    async putService(@Param('id') id : string, @Body() updateServiceDto: UpdateServiceDto) {
        return await this.service.update(id, updateServiceDto);
    }

    @Delete('all')
    async deleteAll() {
        return await this.service.deleteAll();
    }

    @Delete(':id')
    async deleteService(@Param('id') id : string) {
        return await this.service.delete(id);
    }

    @Post()
    async createService(@Body() createServiceDto : CreateServiceDto) {
        return await this.service.create(createServiceDto);
    }
}
