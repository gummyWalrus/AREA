import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class DiscordOauthGuard extends AuthGuard('discord') {}