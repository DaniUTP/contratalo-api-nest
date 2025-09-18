import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: 'Email del usuario',
        example: 'aldanagerardo24@gmail.com',
    })
    @MaxLength(parseInt(process.env.EMAIL_MAX_LENGTH || '100'))
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'Dani$243',
    })
    @IsStrongPassword({
        minLowercase: parseInt(process.env.PASSWORD_MIN_LOWERCASE || '1'),
        minNumbers: parseInt(process.env.PASSWORD_MIN_NUMBERS || '1'),
        minUppercase: parseInt(process.env.PASSWORD_MIN_UPPERCASE || '1'),
        minSymbols: parseInt(process.env.PASSWORD_MIN_SYMBOLS || '1'),
    })
    @MaxLength(parseInt(process.env.PASSWORD_MAX_LENGTH || '150'))
    @MinLength(parseInt(process.env.PASSWORD_MIN_LENGTH || '8'))
    @IsString()
    @IsNotEmpty()
    password: string;
    @ApiProperty({
        description: 'Token fcm del dispositivo',
        example: '1',
    }
    )
    @MaxLength(parseInt(process.env.TOKEN_FCM_MAX_LENGTH || '150'))
    @IsString()
    @IsOptional()
    token_fcm:string;
}
