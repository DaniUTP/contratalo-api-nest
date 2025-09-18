import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtil } from 'src/modules/auth/utils/password.util';
import { CryptoService } from 'src/modules/auth/service/crypto.service';
import { CustomResponse } from 'src/shared/response/customResponse';
import { ConfigService } from '@nestjs/config';
import { AuthInterface } from 'src/modules/auth/interface/auth.interface';
import { ResponseApi } from 'src/shared/response/responseApi';
import { RandomLetterUtil } from '../utils/randomLetter.util';
import { MailService } from 'src/modules/user/service/mail.service';
import { TokenUtil } from 'src/shared/utils/token.util';

@Injectable()
export class AuthService implements AuthInterface {
    private readonly logger = new Logger(AuthService.name);
    private readonly customResponse: CustomResponse;
    private readonly tokenUtil: TokenUtil;
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly cryptoService: CryptoService,
        private readonly mailService: MailService,
    ) {
        this.customResponse = new CustomResponse(this.configService, this.mailService);
        this.tokenUtil = new TokenUtil(this.jwtService, this.configService, this.cryptoService);
    }

    async login(email: string, password: string, tokenFcm: string, language: string) {
        try {
            const user = await this.userService.findByEmail(email, ["id_user", "password", "status"]);
            if (!user) {
                return this.customResponse.responseMessage('notFound', language, HttpStatus.BAD_REQUEST);
            };
            const isValidPassword = await PasswordUtil.comparePassword(password, user.password);
            if (!isValidPassword) {
                return this.customResponse.responseMessage('incorrectPassword', language, HttpStatus.BAD_REQUEST);
            };
            if (user.status == 0) {
                return this.customResponse.responseMessage('notActive', language, HttpStatus.BAD_REQUEST);
            }
            const existTokenFcm = await this.userService.existTokenFcm(tokenFcm);
            if (!existTokenFcm) {
                await this.userService.firebaseRegister(user.id_user, tokenFcm);
            }
            const payload = {
                id: user.id_user
            };

            const token = this.tokenUtil.createToken(payload);
            const personalAccessToken = await this.userService.createToken(user.id_user, token);
            return this.customResponse.responseBody({ access_token: personalAccessToken.id_personal_access_token + '|' + token }, HttpStatus.OK);
        } catch (error) {
            this.logger.error(error.message);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };

    async me(token: string, language: string) {
        try {
            const info = this.jwtService.decode(token.split('|')[1]);
            const payload = this.cryptoService.decrypt(info.payload);
            const user = await this.userService.findByPk(payload.id, ["name", "last_name", "email", "phone"]);
            return this.customResponse.responseBody({ name: user?.name, last_name: user?.last_name, email: user?.email, phone: Number(user?.phone)}, HttpStatus.OK);
        } catch (error) {
            this.logger.error(error.message);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
    async activationAccount(email: string, code: string, language: string): Promise<ResponseApi> {
        try {
            const user = await this.userService.findByEmail(email, ["id_user", "code_active", "status"]);
            if (!user) {
                return this.customResponse.responseMessage('notFound', language, HttpStatus.BAD_REQUEST);
            } else if (user && user.code_active != code) {
                return this.customResponse.responseMessage('notMatchCode', language, HttpStatus.BAD_REQUEST);
            } else if (user && user.status == 1) {
                return this.customResponse.responseMessage('isActivate', language, HttpStatus.BAD_REQUEST);
            }
            await user.update({
                status: 1
            });
            return this.customResponse.responseMessage('activateAccount', language, HttpStatus.OK);
        } catch (error) {
            this.logger.error(error.message);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
    async resendActivation(email: string, language: string): Promise<ResponseApi> {
        try {
            const user = await this.userService.findByEmail(email, ["id_user", "status"]);
            if (!user) {
                return this.customResponse.responseMessage('notFound', language, HttpStatus.BAD_REQUEST);
            }
            else if (user && user.status == 1) {
                return this.customResponse.responseMessage('isActivate', language, HttpStatus.BAD_REQUEST);
            }
            const code = RandomLetterUtil.generateRandomLowercase();
            await user.update({
                code_active: code
            });
            await this.customResponse.sendEmail(user, language, 1);
            return this.customResponse.responseMessage('recoverySent', language, HttpStatus.CREATED);
        } catch (error) {
            this.logger.error(error.message);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
    async recoveryPassword(email: string, language: string): Promise<ResponseApi> {
        try {
            const user = await this.userService.findByEmail(email, ["id_user", "name", "last_name", "email", "status"]);
            if (!user) {
                return this.customResponse.responseMessage('notFound', language, HttpStatus.BAD_REQUEST);
            };
            if (user && user.status == 0) {
                return this.customResponse.responseMessage('notActive', language, HttpStatus.BAD_REQUEST);
            };
            const ahora = new Date();
            const offsetPeru = -5 * 60 * 60 * 1000;
            const fechaPeru = new Date(ahora.getTime() + offsetPeru);
            const payload = {
                id: user.id_user,
                exp: fechaPeru.getTime()
            };
            const payloadCrypt = this.cryptoService.encrypt(payload);
            const body = {
                token: payloadCrypt,
                name: user.name,
                last_name: user.last_name,
                email: user.email
            };
            await this.customResponse.sendEmail(body, language, 2);
            return this.customResponse.responseMessage('recoverySent', language, HttpStatus.OK);
        } catch (error) {
            this.logger.error(error.message);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
    async recoveryValidation(token: string, language: string): Promise<ResponseApi> {
        try {
            let payload;
            try {
                payload = this.cryptoService.decrypt(token);
            } catch (decryptError) {
                this.logger.error(`Error desencriptando token: ${decryptError.message}`);
                return this.customResponse.responseMessage('invalidToken', language, HttpStatus.BAD_REQUEST);
            }
            const tokenUsed = await this.userService.findByPk(payload.id, ["recovery"]);
            if (tokenUsed && tokenUsed.recovery == 1) {
                return this.customResponse.responseMessage('tokenUsed', language, HttpStatus.UNAUTHORIZED);
            }
            const ahoraPeruTimestamp = Date.now() + (-5 * 60 * 60 * 1000);
            const horasTranscurridas = (ahoraPeruTimestamp - payload.exp) / (1000 * 60 * 60);

            if (horasTranscurridas > 24) {
                return this.customResponse.responseMessage('tokenExpired', language, HttpStatus.BAD_REQUEST);
            }

            return this.customResponse.responseMessage('validToken', language, HttpStatus.OK);
        } catch (error) {
            this.logger.error(`Error inesperado en recoveryValidation: ${error.message}`, error.stack);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
    async recoveryPasswordUser(token: string, password: string, language: string): Promise<ResponseApi> {
        try {
            let payload;
            try {
                payload = this.cryptoService.decrypt(token);
            } catch (decryptError) {
                this.logger.error(`Error desencriptando token: ${decryptError.message}`);
                return this.customResponse.responseMessage('invalidToken', language, HttpStatus.BAD_REQUEST);
            }
            const user = await this.userService.findByPk(payload.id, ['id_user', 'recovery', 'status']);
            if (!user) {
                return this.customResponse.responseMessage('notFound', language, HttpStatus.BAD_REQUEST);
            };
            if (user && user.status == 0) {
                return this.customResponse.responseMessage('notActive', language, HttpStatus.BAD_REQUEST);
            };
            if (user && user.recovery == 1) {
                return this.customResponse.responseMessage('tokenUsed', language, HttpStatus.UNAUTHORIZED);
            };
            await user.update({
                password: await PasswordUtil.hashPassword(password),
                recovery: 1
            });
            return this.customResponse.responseMessage('passwordChange', language, HttpStatus.OK);
        } catch (error) {
            this.logger.error(`Error inesperado en recoveryPasswordUser: ${error.message}`);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
    async refreshToken(token: string, language: string): Promise<ResponseApi> {
        try {
            let tokenReturn;
            let tokenSplit = token.split('|')[1];
            let isExpired = this.tokenUtil.isTokenExpired(tokenSplit);
            if (isExpired) {
                await this.userService.deleteToken(parseInt(token.split('|')[0]));
                const info = this.jwtService.decode(tokenSplit);

                const payload = this.cryptoService.decrypt(info.payload);

                const newToken = this.tokenUtil.createToken(payload);

                const personalAccessToken = await this.userService.createToken(payload.id, newToken);

                tokenReturn = personalAccessToken.id_personal_access_token + '|' + newToken;
            }
            else {
                tokenReturn = token;
            };
            return this.customResponse.responseBody({ access_token: tokenReturn }, HttpStatus.OK);

        } catch (error) {
            this.logger.error(`Error inesperado en refreshToken: ${error.message}`);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };

    async logout(tokenFcm: string, token: string, language: string): Promise<ResponseApi> {
        try {
            await this.userService.firebaseDelete(tokenFcm);
            await this.userService.deleteToken(parseInt(token.split('|')[0]));
            return this.customResponse.responseMessage('userLogout', language, HttpStatus.OK);
        } catch (error) {
            this.logger.error(`Error inesperado en logout: ${error.message}`);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
    async delete(token: string, language: string): Promise<ResponseApi> {
        try {
            const payload = this.cryptoService.decrypt(this.tokenUtil.decodeToken(token));
            await this.userService.deleteAccountUser(payload.id);
            return this.customResponse.responseMessage('userDeleted', language, HttpStatus.OK);
        } catch (error) {
            this.logger.error(`Error inesperado en delete: ${error.message}`);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
}      
