import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CryptoService } from "src/modules/auth/service/crypto.service";

export class TokenUtil {
    constructor(private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly cryptoService: CryptoService) { }
    public isTokenExpired(token: string): boolean {
        try {
            this.jwtService.verify(token, {
                secret: this.configService.get<string>("JWT_SECRET"),
            });
            return false;
        } catch (error) {
            console.log(error.message)
            if (error.name === 'TokenExpiredError') {
                return true;
            }
            throw new UnauthorizedException('Token inválido');
        }
    };
    public createToken(payload: object): string {
        return this.jwtService.sign(
            {
                payload: this.cryptoService.encrypt(payload)
            },
            {
                expiresIn: this.configService.get<string>("JWT_EXPIRES_IN"),
                secret: this.configService.get<string>("JWT_SECRET"),
            });
    }
    public decodeToken(token:string):string{
        return this.jwtService.decode(token);
    }
}