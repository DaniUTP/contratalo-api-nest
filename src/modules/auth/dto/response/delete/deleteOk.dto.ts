import { ApiProperty } from "@nestjs/swagger";

export class DeleteOKDto{
    @ApiProperty({
        description:"Usuario eliminado correctamente",
        example:"Usuario eliminado satisfactoriamente"
    })
    message:string;
}