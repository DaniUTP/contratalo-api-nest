import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { JwtModule } from '@nestjs/jwt';
import { CryptoService } from '../../auth/service/crypto.service';
import { UserController } from '../controller/user.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '../service/mail.service';
import { UserFirebases } from '../entity/userFirebases.entity';
import { PersonalAccessToken } from '../entity/personalAccessToken.entity';

@Module({
  imports:[SequelizeModule.forFeature([User,UserFirebases,PersonalAccessToken]),JwtModule,MailerModule],
  controllers: [UserController],
  providers: [UserService,CryptoService,MailService],
  exports:[UserService]
})
export class UserModule {}
