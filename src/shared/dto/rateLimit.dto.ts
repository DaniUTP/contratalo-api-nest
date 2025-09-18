import { ApiProperty } from "@nestjs/swagger";

export class RatelimitDto {
    @ApiProperty({
        description: 'Mensaje de limite de petición',
        example: 'Se superó el limite de petición',
    })
    message: string;
}