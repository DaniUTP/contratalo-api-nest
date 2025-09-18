import { HttpStatus, InternalServerErrorException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { I18nContext } from 'nestjs-i18n';
import { ConstantsUtil } from 'src/shared/utils/constants.util';
import { MailService } from 'src/modules/user/service/mail.service';
import { ResponseApi } from './responseApi';
import { ConfigService } from '@nestjs/config';

export class CustomResponse {
    private readonly logger = new Logger(CustomResponse.name);
    private readonly mailService: MailService | null;
    private readonly configService: ConfigService | null;
    constructor(configService?: ConfigService, mailService?: MailService) {
        this.mailService = mailService || null;
        this.configService = configService || null;
    }
    getLanguage(language: string) {
        let supportedLanguages: string[] = ['es'];
        try {
            const languagesPath = path.join(process.cwd(), 'dist', 'core', 'i18n', 'language.json');

            if (fs.existsSync(languagesPath)) {
                const fileContent = fs.readFileSync(languagesPath, 'utf-8');
                const languagesData = JSON.parse(fileContent);
                supportedLanguages = Object.keys(languagesData);
            } else {
                console.warn('Archivo languages.json no encontrado en:', languagesPath);
            }
        } catch (error) {
            this.logger.log('Error al cargar languages.json:', error.message);
        }
        if (!supportedLanguages.includes(language)) {
            language = 'es';
        }
        return language;
    }
    responseValidation(message: string, field: string, lang: string) {
        try {
            const language = this.getLanguage(lang);
            const i18n = I18nContext.current();
            const dynamicValue = ConstantsUtil.getConstraintValue(field, message);
            console.log("Valor del dynamic:", dynamicValue)
            return i18n?.t('messages.' + message, {
                args: {
                    constraint: dynamicValue
                },
                lang: language
            });
        } catch (error) {
            this.logger.log('Error al generar el mensaje de validación: ', error.message);
        }
    }
    responseMessage(message: string, lang: string, status: number): ResponseApi {
        try {
            const language = this.getLanguage(lang);
            const i18n = I18nContext.current();
            const messageTranslate = i18n?.t('messages.' + message, {
                lang: language
            });
            console.log("message translate: ", messageTranslate);
            return {
                response: { message: messageTranslate },
                statusCode: status
            };
        } catch (error) {
            this.logger.log('Error al generar el mensaje de respuesta: ', error.message);
            return {
                response: { message: 'Error interno del servidor' },
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            };
        }
    };
    responseInternalError(message: string, lang: string): ResponseApi {
        const language = this.getLanguage(lang);
        const i18n = I18nContext.current();
        const messageTranslate = i18n?.t('messages.' + message, {
            lang: language
        });
        throw new InternalServerErrorException(messageTranslate);
    };
    responseBody(body: Object, status: number): ResponseApi {
        return {
            response: body,
            statusCode: status
        };
    };
    translateMessages(message: string, lang: string) {
        const language = this.getLanguage(lang);
        const i18n = I18nContext.current();
        return i18n?.t('messages.' + message, {
            lang: language
        });
    };
    async sendEmail(data: any, language: string, type: number) {
        let messages = {};
        if (type == 1) {
            messages = {
                codeActive: this.translateMessages('codeActive', language),
                hello: this.translateMessages('hello', language),
                contratalo: this.translateMessages('contratalo', language),
                messageActivation: this.translateMessages('messageActivation', language),
                goodDay: this.translateMessages('goodDay', language),
                contrataloTeam: this.translateMessages('contrataloTeam', language),
                messageTo: this.translateMessages('messageTo', language),
                messageHaveQuestion: this.translateMessages('messageHaveQuestion', language),
                reserved: this.translateMessages('reserved', language),
            };
        }
        else if (type == 2) {
            const url = this.configService?.get<string>('RECOVERY_REDIRECT') || null;
            messages = {
                url: url ? url.replace(":token", data.token) : "",
                recoveryEmail: this.translateMessages('recoveryEmail', language),
                newAccess: this.translateMessages('newAccess', language),
                hello: this.translateMessages('hello', language),
                contratalo: this.translateMessages('contratalo', language),
                messageActivation: this.translateMessages('messageActivation', language),
                goodDay: this.translateMessages('goodDay', language),
                contrataloTeam: this.translateMessages('contrataloTeam', language),
                messageTo: this.translateMessages('messageTo', language),
                messageHaveQuestion: this.translateMessages('messageHaveQuestion', language),
                reserved: this.translateMessages('reserved', language),
                messageExpiration: this.translateMessages('messageExpiration', language),
                messageRecomendation: this.translateMessages('messageRecomendation', language),
                messageBottomRecover: this.translateMessages('messageBottomRecover', language)
            };
        }
        if (this.mailService) {
            await this.mailService.sendEmail(data, messages, type).then(() => {
                this.logger.log('Email sent');
            }).catch((error) => {
                this.logger.log('Error sending email: ', error.message);
            });
        }
    }
}
