import { ApiProperty } from "@nestjs/swagger";

export class LogoutOkDto{
    @ApiProperty({
        description:"Sesion cerrada satisfactoriamente",
        example:"Sesión cerrada"
    })
    message:string;
}