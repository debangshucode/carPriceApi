import {IsEmail,IsString,IsOptional} from 'class-validator'
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
export class updateUserDto {
    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    email:string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    password:string;
}