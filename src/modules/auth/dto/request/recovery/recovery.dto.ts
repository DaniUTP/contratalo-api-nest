import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class RecoveryDto {
    @ApiProperty({
        description: 'Email del usuario',
        example: 'aldanagerardo24@gmail.com',
    })
    @MaxLength(parseInt(process.env.EMAIL_MAX_LENGTH || '100'))
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}