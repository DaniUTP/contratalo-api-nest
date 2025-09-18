import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/service/user.service';
import { CustomResponse } from 'src/shared/response/customResponse';

@Injectable()
export class ValidateTokenGuard implements CanActivate {
  private readonly customResponse = new CustomResponse();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const language = request.query.lang;

    if (!request.headers.authorization) {
      throw new UnauthorizedException(this.customResponse.translateMessages('noToken', language));
    };

    return this.validateToken(request.headers.authorization, language);
  };

  private async validateToken(token: string, language: string) {
    if (!token.includes('|') || token.split('|').length !== 2) {
      throw new UnauthorizedException(this.customResponse.translateMessages('notStructureToken', language));
    }

    const tokenSplit = token.split('|');
    const personalTokenId = parseInt(tokenSplit[0]);

    if (isNaN(personalTokenId) || personalTokenId <= 0) {
      throw new UnauthorizedException(this.customResponse.translateMessages('invalidToken', language));
    }

    const foundToken = await this.userService.existToken(personalTokenId);
    if (!foundToken) {
      throw new UnauthorizedException(this.customResponse.translateMessages('invalidToken', language));
    }

    try {
      this.jwtService.verify(tokenSplit[1], {
        secret: this.configService.get<string>("JWT_SECRET"),
      });
      return true;
    } catch (error) {

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(this.customResponse.translateMessages('expiredToken', language));
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(this.customResponse.translateMessages('invalidToken', language));
      }
      console.error('Token validation error:', error.message);
      throw new UnauthorizedException(this.customResponse.translateMessages('invalidToken', language));
    }
  }
}