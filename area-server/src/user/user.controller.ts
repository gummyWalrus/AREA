import { Body, Controller, Post, Put, Delete, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService,
        private readonly config : ConfigService,
        private readonly authService: AuthService) {}
    
    @Get()
    @UseGuards(JwtAuthGuard)
    async get(@Req() req, @Res() res) {
        const user = await this.service.findOne(req.user.userId);
        if (!user)
            res.status(404).send();
        else res.json(user);
    }

    @Post('register')
    async create(@Body() createUserDto: CreateUserDto) {
        return this.service.findByEmail(createUserDto.email).then((user) => {
            if (user.length === 0) {
                return this.service.create(createUserDto).then(async (user) => {
                    const jwt = await this.authService.login(user);
                    return {user: user, ...jwt}
                }).catch((error) => {
                    console.error(error);
                    return {"msg": "Could not create new user"};
                });
            } else {
                return {"msg": "email already in use"};
            }
        })
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async update(@Req() req, @Body() updateUserDto : UpdateUserDto) {
        if (updateUserDto.email) {
            return this.service.findByEmail(updateUserDto.email).then((user) => {
                if (user.length === 0) {
                    return this.service.update(req.user.userId, updateUserDto).then((user) => {
                        return user;
                    }).catch((error) => {
                        console.error(error);
                        return {"msg": "Could not update user"};
                    });
                } else {
                    return {"msg": "email already in use"};
                }
            })
        } else {
            return this.service.update(req.user.userId, updateUserDto).then((user) => {
                return user;
            }).catch((error) => {
                console.error(error);
                return {"msg": "Could not update user"};
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@Req() req) {
        return this.service.delete(req.user.userId);
    }
}
