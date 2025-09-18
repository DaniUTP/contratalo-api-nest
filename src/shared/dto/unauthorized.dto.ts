import { ApiProperty } from "@nestjs/swagger";

export class UnauthorizedDto {
    @ApiProperty({
        description: 'Mensaje de error',
        example: 'Token no enviado',
    })
    message: string;
}