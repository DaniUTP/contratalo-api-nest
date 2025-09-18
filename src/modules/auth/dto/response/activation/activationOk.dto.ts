import { ApiProperty } from "@nestjs/swagger";

export class ActivationOkDto{
    @ApiProperty({
        description:"Mensaje de activacción satisfactoria",
        example:"Tu cuenta ha sido activada correctamente"
    })
    message:string;
}