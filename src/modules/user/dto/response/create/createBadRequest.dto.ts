import { ApiProperty } from "@nestjs/swagger";

export class CreateBadRequestDto
{
    @ApiProperty({
        description: 'Mensaje de error',
        example: {
            "email":"El campo es requerido",
            "name":"El campo es requerido",
            "last_name":"El campo es requerido",
            "password":"El campo es requerido"
        },
    })
    errors:{
        [key: string]: string[];
    };
}