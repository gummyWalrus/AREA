import { Controller, Get, Param, Put, Body, Post, Delete, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('reactions')
export class ReactionController {
    constructor(private readonly service: ReactionService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return await this.service.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.service.findOne(id);
    }

    @Put(':id')
    async putReaction(@Param('id') id: string, @Body() updateReactionDto: UpdateReactionDto) {
        return await this.service.update(id, updateReactionDto);
    }

    @Post()
    async createReaction(@Body() createReactionDto: CreateReactionDto) {
        return await this.service.create(createReactionDto);
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
