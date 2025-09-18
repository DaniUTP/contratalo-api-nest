import { ApiProperty } from "@nestjs/swagger";

export class ActivationBadRequestDto{
    @ApiProperty({
        description: 'Mensaje de error',
        example:"El campo es requerido"
    })
    message:string;
}