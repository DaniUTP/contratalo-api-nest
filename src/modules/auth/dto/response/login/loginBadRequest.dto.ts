import { ApiProperty } from "@nestjs/swagger";

export class LoginBadRequestDto
{
    @ApiProperty({
        description: 'Mensaje de error',
        example: {
            "email":"El campo es requerido",
            "password":"El campo es requerido"
        },
    })
    errors:{
        [key: string]: string[];
    };
}