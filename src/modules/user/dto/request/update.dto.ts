import { ApiProperty } from "@nestjs/swagger";
import {IsInt, IsNotEmpty,IsOptional,IsString, Matches, MaxLength, MinLength } from "class-validator";
export class UpdateUserDto {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Daniel'
    })
    @MaxLength(parseInt(process.env.NAME_MAX_LENGTH || '20'))
    @MinLength(parseInt(process.env.NAME_MIN_LENGTH || '2'))
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({
        description: 'Apellido del usuario',
        example: 'Aldana'
    })
    @MaxLength(parseInt(process.env.LAST_NAME_MAX_LENGTH || '20'))
    @MinLength(parseInt(process.env.LAST_NAME_MIN_LENGTH || '2'))
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    @IsString()
    @IsNotEmpty()
    last_name: string;
    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '987654321'
    })
    @IsInt()
    @IsOptional()
    phone:number;
}
