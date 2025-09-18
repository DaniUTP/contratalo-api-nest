import { HttpStatus } from "@nestjs/common";

export class ResponseApi {
    statusCode: number | HttpStatus.INTERNAL_SERVER_ERROR;
    response: Object;
}