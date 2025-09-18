import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class RecoveryPasswordDto{
    @ApiProperty({
        description:"Nueva contraseña del usuario",
        example:"Dani$243"
    })
    @MaxLength(parseInt(process.env.PASSWORD_MAX_LENGTH ||'150'))
    @IsString()
    @IsNotEmpty()
    newPassword:string;
}