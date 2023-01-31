import {IsEmail, IsNotEmpty} from "class-validator";

export class CreateMailDto {
    @IsNotEmpty()
    to: string[];

    @IsNotEmpty()
    @IsEmail()
    from: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    message: string;
}
