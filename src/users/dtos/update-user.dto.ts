import { IsEmail, IsString, IsOptional } from "class-validator";

export class UpdateUserDto {

    @IsEmail()
    @IsOptional()   //checking is optional because we can have update in either email or passwrod or both at a time
    email: string;

    @IsString()
    @IsOptional()
    password: string
}