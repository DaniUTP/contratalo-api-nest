import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, MaxLength, IsString, Length } from "class-validator";

export class ActivationAccountDto {
    @ApiProperty({
        description:"Email del usuario",
        example:"aldanagerardo24@gmail.com"
    })
    @MaxLength(parseInt(process.env.EMAIL_MAX_LENGTH || '100'))
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty({
        description:"Código de activación",
        example:"5ildrg"
    })
    @Length(parseInt(process.env.CODE_MIN_LENGTH || '6'),parseInt(process.env.CODE_MAX_LENGTH || '6'))
    @IsString()
    @IsNotEmpty()
    code: string;
}