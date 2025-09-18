import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class TokenFcmDto{
    @ApiProperty({
        description:"Token_fcm",
        example:"1"
    })
    @MaxLength(parseInt(process.env.TOKEN_FCM_MAX_LENGTH || '150'))
    @IsString()
    @IsOptional()
    token_fcm:string;
}