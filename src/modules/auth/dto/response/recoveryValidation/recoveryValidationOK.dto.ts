import { ApiProperty } from "@nestjs/swagger";

export class RecoveryValidationOkDto {
    @ApiProperty({
        description: "El token es válido",
        example: "El token es válido"
    })
    message: string;
}