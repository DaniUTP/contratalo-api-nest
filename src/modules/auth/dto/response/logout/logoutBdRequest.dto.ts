import { ApiProperty } from "@nestjs/swagger";

export class LogoutBadRequestDto{
        @ApiProperty({
            description:"El campo token fcm es incorrecto",
            example:"El campo debe ser texto"
        })
        message:string;
}