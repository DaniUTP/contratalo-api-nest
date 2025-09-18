import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { PasswordUtil } from 'src/modules/auth/utils/password.util';
import { RandomLetterUtil } from 'src/modules/auth/utils/randomLetter.util';
import { CryptoService } from '../../auth/service/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { CustomResponse } from 'src/shared/response/customResponse';
import { MailService } from './mail.service';
import { ResponseApi } from 'src/shared/response/responseApi';
import { CreateUserType } from 'src/modules/user/types/createUser.type';
import { UpdateUserType } from 'src/modules/user/types/updateUser.type';
import { UserFirebases } from '../entity/userFirebases.entity';
import { UserInterface } from '../interface/user.interface';
import { ConfigService } from '@nestjs/config';
import { PersonalAccessToken } from '../entity/personalAccessToken.entity';

@Injectable()
export class UserService implements UserInterface {
    private readonly logger = new Logger(UserService.name);
    private readonly customResponse: CustomResponse;
    constructor(
        @InjectModel(User) readonly userEntity: typeof User,
        @InjectModel(UserFirebases) readonly userFirebasesEntity: typeof UserFirebases,
        @InjectModel(PersonalAccessToken) readonly personalAccessToken: typeof PersonalAccessToken,
        private readonly jwtService: JwtService,
        private readonly cryptoService: CryptoService,
        private readonly mailService: MailService,
        private readonly configService: ConfigService
    ) {
        this.customResponse = new CustomResponse(this.configService, this.mailService);
    }

    async findByEmail(email: string, attributes: Array<string>) {
        return await this.userEntity.findOne({
            attributes: attributes,
            where: {
                email: email
            }
        });
    };
    async findByPk(id: number, attributes: Array<string>) {
        return await this.userEntity.findByPk(id, {
            attributes: attributes
        });
    };
    async existTokenFcm(tokenFcm: string) {
        const count = await this.userFirebasesEntity.count({
            where: {
                token_firebase: tokenFcm
            }
        });
        return count > 0;
    };
    async existUser(email: string) {
        const count = await this.userEntity.count({
            where: {
                email: email
            }
        });
        return count > 0;
    };
    async firebaseRegister(idUser: number, tokenFcm: string) {
        await this.userFirebasesEntity.create({
            id_user: idUser,
            token_firebase: tokenFcm,
            status: 1
        });
    };
    async firebaseDelete(tokenFcm: string) {
        await this.userFirebasesEntity.destroy({
            where: {
                token_firebase: tokenFcm
            }
        });
    };
    async deleteAccountUser(id: number) {
        await this.userEntity.destroy({
            where: {
                id_user: id
            }
        });
        await this.userFirebasesEntity.destroy({
            where: {
                id_user: id
            }
        });
        await this.personalAccessToken.destroy({
            where: {
                id_user: id
            }
        });
    };
    async createToken(id: number, token: string) {
        return await this.personalAccessToken.create({
            id_user: id,
            token: await PasswordUtil.hashPassword(token),
            status: 1
        });
    };
    async existToken(id: number): Promise<boolean> {
        const countRegister = await this.personalAccessToken.count({
            where: {
                id_personal_access_token: id
            }
        });
        return countRegister > 0;
    };
    async deleteToken(id: number) {
        await this.personalAccessToken.destroy({
            where: {
                id_personal_access_token: id
            }
        });
    };
    async create(userData: CreateUserType, language: string): Promise<ResponseApi> {
        try {
            const user = await this.existUser(userData.email);
            if (user) {
                return this.customResponse.responseMessage('userExist', language, HttpStatus.BAD_REQUEST);
            }
            const createdUser = await this.userEntity.create({
                email: userData.email,
                password: await PasswordUtil.hashPassword(userData.password),
                name: userData.name,
                last_name: userData.last_name,
                type: 1,
                code_active: RandomLetterUtil.generateRandomLowercase(),
                level: 1,
                photo: !userData.photo ? "" : userData.photo,
                is_social_login: 1,
                status: 0,
            });
            await this.customResponse.sendEmail(createdUser, language, 1);
            return this.customResponse.responseMessage('sentVerification', language, HttpStatus.CREATED);
        } catch (error) {
            this.logger.error(error.message);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
    async update(userData: UpdateUserType, token: string, language: string): Promise<ResponseApi> {
        try {
            const info = this.jwtService.decode(token.split('|')[1]);
            const payload = this.cryptoService.decrypt(info.payload);
            await this.userEntity.update({
                name: userData.name,
                last_name: userData.last_name,
                phone: !userData.phone ? "" : userData.phone,
            }, {
                where: {
                    id_user: payload.id
                }
            });
            return this.customResponse.responseMessage('profileUpdated', language, HttpStatus.OK);
        } catch (error) {
            this.logger.error(error.message);
            return this.customResponse.responseInternalError('internalServerError', language);
        }
    };
}
