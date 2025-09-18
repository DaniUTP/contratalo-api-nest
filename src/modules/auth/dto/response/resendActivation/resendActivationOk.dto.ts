import { ApiProperty } from "@nestjs/swagger";

export class ResendActivationOkDto
{
    @ApiProperty({
        description:"Mensaje de reenvio de código",
        example:"La ayuda va en camino, te hemos enviado un correo electrónico."
    })
    message:string;
}