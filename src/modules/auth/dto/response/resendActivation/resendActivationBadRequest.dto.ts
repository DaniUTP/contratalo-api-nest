import { ApiProperty } from "@nestjs/swagger";

export class ResendActivationBadRequestDto
{
     @ApiProperty({
        description: 'Mensaje de error',
        example: "El campo es requerido"
    })
    message:string;
}
