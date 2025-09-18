import { ResponseApi } from "../../../shared/response/responseApi";

export interface AuthInterface
{
    login(email:string,password:string,tokenFcm:string,language:string):Promise<ResponseApi>;
    me(token:string,language:string):Promise<ResponseApi>;
    activationAccount(email:string,code:string,language:string):Promise<ResponseApi>;
    resendActivation(email:string,language:string):Promise<ResponseApi>;
    recoveryPassword(email:string,language:string):Promise<ResponseApi>;
    recoveryValidation(token:string,language:string):Promise<ResponseApi>;
    recoveryPasswordUser(token:string,password:string,language:string):Promise<ResponseApi>;
    refreshToken(token:string,language:string):Promise<ResponseApi>;
    logout(tokenFcm:string,token:string,language:string):Promise<ResponseApi>;
    delete(token:string,language:string):Promise<ResponseApi>;
}