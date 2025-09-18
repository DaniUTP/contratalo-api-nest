import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class ResendActivationDto {
    @ApiProperty({
        description:"El email del usuario",
        example:"aldanagerardo24@gmail.com"
    })
    @MaxLength(parseInt(process.env.EMAIL_MAX_LENGTH || '100'))
    @IsEmail()
    @IsNotEmpty()
    email: string;
}