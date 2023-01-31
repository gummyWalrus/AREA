import { BaseUserDto } from './base-user.dto'

export class UpdateUserDto extends BaseUserDto {
    github?: {
        token: string;
        username?: string
    };
    google?: {
        token: string;
        email?: string;
        username?: string
    };;
    twitter?: {
        token: string;
        username?: string
    };;    
    reddit?: {
        token: string;
        username?: string
    };
    discord?: {
        token: string;
        username?: string;
        id?: string;
    } 
}