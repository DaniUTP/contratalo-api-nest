import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { CryptoService } from '../service/crypto.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../user/module/user.module';
import { MailService } from 'src/modules/user/service/mail.service';

@Module({
  imports:[JwtModule,UserModule],
  controllers: [AuthController],
  providers: [AuthService,CryptoService,MailService],
})
export class AuthModule {}
