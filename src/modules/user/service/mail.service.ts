import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendEmail(data: any, messages: any, type: number): Promise<void> {
    let body = {};
    if (type == 1) {
      body = {
        to: data.email,
        subject: messages.codeActive,
        template: './ActivationProfile.html',
        context: {
          codeActive:messages.codeActive,
          name: data.name,
          lastname: data.last_name,
          email: data.email,
          code: data.code_active,
          hello: messages.hello,
          contratalo: messages.contratalo,
          messageActivation: messages.messageActivation,
          goodDay: messages.goodDay,
          contrataloTeam: messages.contrataloTeam,
          messageTo: messages.messageTo,
          messageHaveQuestion: messages.messageHaveQuestion,
          reserved: messages.reserved,
          year: new Date().getFullYear()
        },
      };
    }
    else if (type == 2) {
      body = {
        to: data.email,
        subject: messages.recoveryEmail,
        template: './RecoveryPassword.html',
        context: {
          recoveryEmail:messages.recoveryEmail,
          messageBottomRecover:messages.messageBottomRecover,
          url:messages.url,
          name: data.name,
          newAccess:messages.newAccess,
          last_name: data.last_name,
          messageExpiration:messages.messageExpiration,
          messageRecomendation:messages.messageRecomendation,
          email: data.email,
          hello: messages.hello,
          contratalo: messages.contratalo,
          messageActivation: messages.messageActivation,
          goodDay: messages.goodDay,
          contrataloTeam: messages.contrataloTeam,
          messageTo: messages.messageTo,
          messageHaveQuestion: messages.messageHaveQuestion,
          reserved: messages.reserved,
          year: new Date().getFullYear()
        },
      };
    }
    await this.mailerService.sendMail(body);
  }
}