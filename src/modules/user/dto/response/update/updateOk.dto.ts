import { ApiProperty } from "@nestjs/swagger";

export class UpdateOkDto
{
    @ApiProperty({
        description: 'Mensaje de éxito',
        example: 'Usuario actualizado exitosamente',
    })
    message:string;
}