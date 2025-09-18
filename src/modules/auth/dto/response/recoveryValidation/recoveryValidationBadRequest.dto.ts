import { ApiProperty } from "@nestjs/swagger";

export class RecoveryValidationBadRequestDto{
    @ApiProperty({
        description:"El token es invalido",
        example:"El token es inválido"
    })    
    message:string;
}