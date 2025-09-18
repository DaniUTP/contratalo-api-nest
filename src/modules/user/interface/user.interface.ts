import { CreateUserDto } from "src/modules/user/dto/request/create.dto";
import { ResponseApi } from "src/shared/response/responseApi";

export interface UserInterface
{
    create(user:CreateUserDto,language:string):Promise<ResponseApi>;
}