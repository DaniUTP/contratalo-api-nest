import { ApiProperty } from "@nestjs/swagger";

export class UpdateBadRequestDto {
    @ApiProperty({
        description: 'Errores de validación',
        example: {
            'email': 'El campo es requerido',
            'last_name': 'El campo es requerido'
        }
    })
    errors: {
        [key: string]: string[];
    };
}