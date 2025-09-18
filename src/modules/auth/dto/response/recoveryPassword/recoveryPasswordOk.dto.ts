import { ApiProperty } from "@nestjs/swagger";

export class RecoveryPasswordOkDto{
    @ApiProperty({
        description:"Se cambio la contraseña correctamente",
        example:"Se actualizó la contraseña"
    })    
    message:string;
}