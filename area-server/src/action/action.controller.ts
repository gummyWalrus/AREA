import { Controller, Get, Param, Put, Body, Post, Delete, UseGuards } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import {JwtAuthGuard} from 'src/auth/jwt/jwt-auth.guard';

@Controller('actions')
export class ActionController {
    constructor(private readonly service: ActionService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll() {
        return await this.service.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.service.findOne(id);
    }

    @Put(':id')
    async putAction(@Param('id') id: string, @Body() updateActionDto: UpdateActionDto) {
        return await this.service.update(id, updateActionDto);
    }

    @Post()
    async createAction(@Body() createActionDto: CreateActionDto) {
        return await this.service.create(createActionDto);
    }

    @Delete('all')
    async deleteAll() {
        return await this.service.deleteAll();
    }
    
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
