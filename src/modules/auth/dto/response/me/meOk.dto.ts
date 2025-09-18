import { ApiProperty } from "@nestjs/swagger";

export class MeOKDto {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Daniel',
    })
    name: string;
    @ApiProperty({
        description: 'Email del usuario',
        example: 'aldanagerardo24@gmail.com',
    })
    email: string;
}