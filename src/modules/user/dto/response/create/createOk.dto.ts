import { ApiProperty } from "@nestjs/swagger";

export class CreateOkDto {
    @ApiProperty(
        {
            description: 'Usuario creado',
            example: 'Revise su correo electrónico e ingrese el código enviado'
        }
    )
    message: string;
}