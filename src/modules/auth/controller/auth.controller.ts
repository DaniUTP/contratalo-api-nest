import { Body, Controller, Delete, Get, Headers, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/request/login/login.dto';
import { Response } from 'express';
import { FormatManyValidationInterceptor } from 'src/core/interceptor/format-many-validation.interceptor';
import { ApiBadRequestResponse, ApiBody, ApiHeaders, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginOkDto } from '../dto/response/login/loginOk.dto';
import { LoginBadRequestDto } from '../dto/response/login/loginBadRequest.dto';
import { InternalServerDto } from '../../../shared/dto/internalError.dto';
import { MeOKDto } from '../dto/response/me/meOk.dto';
import { UnauthorizedDto } from '../../../shared/dto/unauthorized.dto';
import { ValidateTokenGuard } from 'src/core/guard/validate-token.guard';
import { LanguageDto } from 'src/shared/dto/language.dto';
import { ResponseApi } from 'src/shared/response/responseApi';
import { ActivationAccountDto } from '../dto/request/activation/activation.dto';
import { ActivationOkDto } from '../dto/response/activation/activationOk.dto';
import { ActivationBadRequestDto } from '../dto/response/activation/activationBadRequest.dto';
import { ResendActivationDto } from '../dto/request/resendActivation/resendActivation.dto';
import { FormatSingleValidationInterceptor } from 'src/core/interceptor/format-single-validation.interceptor';
import { ResendActivationOkDto } from '../dto/response/resendActivation/resendActivationOk.dto';
import { ResendActivationBadRequestDto } from '../dto/response/resendActivation/resendActivationBadRequest.dto';
import { TokenFcmDto } from '../dto/request/logout/tokenFcm.dto';
import { DeleteOKDto } from '../dto/response/delete/deleteOk.dto';
import { LogoutOkDto } from '../dto/response/logout/logoutOk.dto';
import { LogoutBadRequestDto } from '../dto/response/logout/logoutBdRequest.dto';
import { RecoveryValidationOkDto } from '../dto/response/recoveryValidation/recoveryValidationOK.dto';
import { RecoveryValidationBadRequestDto } from '../dto/response/recoveryValidation/recoveryValidationBadRequest.dto';
import { RecoveryPasswordDto } from '../dto/request/recoveryPassword/recoveryPassword.dto';
import { RecoveryDto } from '../dto/request/recovery/recovery.dto';
import { Throttle } from '@nestjs/throttler';
import { RatelimitDto } from 'src/shared/dto/rateLimit.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @ApiOperation({
    summary: 'Permite autenticar un usuario',
    description: "Autentica un usuario de la base de datos"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiBody({
    type: LoginDto
  })
  @ApiOkResponse({
    description: "Usuario logueado exitosamente",
    type: LoginOkDto
  })
  @ApiBadRequestResponse({
    description: "Error en la solicitud",
    type: LoginBadRequestDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_LOGIN || '3'), ttl: 60000 } })
  @Post('/login')
  @UseInterceptors(FormatManyValidationInterceptor)
  async login(@Query() language: LanguageDto, @Body() loginDto: LoginDto, @Res() response: Response): Promise<Response> {
    const data: ResponseApi = await this.authService.login(loginDto.email, loginDto.password, loginDto.token_fcm, language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @ApiOperation({
    summary: 'Permite obtener información del usuario autenticado',
    description: "Obtiene información del usuario autenticado a partir del token"
  })
  @ApiSecurity('JWT-auth')
  @Get('/me')
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiOkResponse({
    description: "Usuario logueado exitosamente",
    type: MeOKDto
  })
  @ApiUnauthorizedResponse({
    description: "No se ha autenticado el usuario",
    type: UnauthorizedDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseGuards(ValidateTokenGuard)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_ME || '2'), ttl: 60000 } })
  async me(@Query() language: LanguageDto, @Req() request: Request, @Res() response: Response): Promise<Response> {
    const data: ResponseApi = await this.authService.me(request.headers["authorization"], language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @ApiOperation({
    summary: 'Permite activar la cuenta del usuario',
    description: "A partir del código enviado por email te permitirá activar la cuenta"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiBody({
    type: ActivationAccountDto
  })
  @ApiOkResponse({
    description: "Activación satisfactoria",
    type: ActivationOkDto
  }
  )
  @ApiBadRequestResponse({
    description: "Error en la solicitud",
    type: ActivationBadRequestDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseInterceptors(FormatSingleValidationInterceptor)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_ACTIVATION || '3'), ttl: 60000 } })
  @Post('/activation')
  async activationAccount(@Query() language: LanguageDto, @Body() activationAccount: ActivationAccountDto, @Res() response: Response): Promise<Response> {
    const data: ResponseApi = await this.authService.activationAccount(activationAccount.email, activationAccount.code, language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @ApiOperation({
    summary: 'Permite enviar código de activación',
    description: "Permite reenviar nuevamente el código de activación al correo"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiBody({
    type: ResendActivationDto
  })
  @ApiOkResponse({
    description: "Envio de código satisfactorio",
    type: ResendActivationOkDto
  }
  )
  @ApiBadRequestResponse({
    description: "Error en la solicitud",
    type: ResendActivationBadRequestDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseInterceptors(FormatSingleValidationInterceptor)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_RESEND_ACTIVATION || '3'), ttl: 60000 } })
  @Post('/resend-activation')
  async resendActivation(@Query() language: LanguageDto, @Body() resendActivation: ResendActivationDto, @Res() response: Response): Promise<Response> {
    const data: ResponseApi = await this.authService.resendActivation(resendActivation.email, language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @ApiOperation({
    summary: 'Permite recuperar la contraseña',
    description: "Permite recuperar la contraseña a partir de su correo electronico"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiBody({
    type: RecoveryPasswordDto
  })
  @ApiOkResponse({
    description: "Envio de código satisfactorio",
    type: ResendActivationOkDto
  }
  )
  @ApiBadRequestResponse({
    description: "Error en la solicitud",
    type: ResendActivationBadRequestDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseInterceptors(FormatSingleValidationInterceptor)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_RECOVERY || '3'), ttl: 60000 } })
  @Post('/recovery')
  async recoveryPassword(@Query() language: LanguageDto, @Body() recoveryPassword: RecoveryDto, @Res() response: Response): Promise<Response> {
    const data: ResponseApi = await this.authService.recoveryPassword(recoveryPassword.email, language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @Post('/recovery-validation')
  @ApiOperation({
    summary: 'Permite validar el token',
    description: "Permite validar la autenticidad del token"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiHeaders([
    {
      name: 'token',
      description: 'token generado',
      required: true
    }
  ])
  @ApiOkResponse({
    description: "Envio de código satisfactorio",
    type: RecoveryValidationOkDto
  }
  )
  @ApiBadRequestResponse({
    description: "Error en la solicitud",
    type: RecoveryValidationBadRequestDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseInterceptors(FormatSingleValidationInterceptor)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_RECOVERY_VALIDATION || '3'), ttl: 60000 } })
  async recoveryValidation(@Query() language: LanguageDto, @Req() request: Request, @Res() response: Response): Promise<Response> {
    const data: ResponseApi = await this.authService.recoveryValidation(request.headers["token"], language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @Post('/recovery-password')
  @ApiOperation({
    summary: 'Permite cambiar la contraseña del usuario',
    description: "Permite cambiar la contraseña del usuario con el token"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiHeaders([
    {
      name: 'token',
      description: 'Token',
      required: true
    }
  ])
  @ApiBody({
    type: RecoveryPasswordDto
  })
  @ApiOkResponse({
    description: "Envio de código satisfactorio",
    type: RecoveryPasswordDto
  }
  )
  @ApiBadRequestResponse({
    description: "Error en la solicitud",
    type: ResendActivationBadRequestDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseInterceptors(FormatSingleValidationInterceptor)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_RECOVERY_PASSWORD || '3'), ttl: 60000 } })
  async recoveryPasswordUser(@Query() language: LanguageDto, @Headers('token') token: string, @Body() body: { newPassword: string }, @Res() response: Response): Promise<Response> {
    const data: ResponseApi = await this.authService.recoveryPasswordUser(token, body.newPassword, language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @ApiSecurity('JWT-auth')
  @Post('/refresh')
  @ApiOperation({
    summary: 'Permite refrezcar el token',
    description: "Permite refrezcar el token brindado"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiOkResponse({
    description: "Token refrezcado correctamente",
    type: LoginOkDto
  }
  )
  @ApiUnauthorizedResponse({
    description: "Token no enviado",
    type: UnauthorizedDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @UseGuards(ValidateTokenGuard)
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseInterceptors(FormatSingleValidationInterceptor)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_REFRESH || '3'), ttl: 60000 } })
  async refreshToken(@Query() language: LanguageDto, @Req() request: Request, @Body() body: { newPassword: string }, @Res() response: Response): Promise<Response> {
    const data: ResponseApi = await this.authService.refreshToken(request.headers["authorization"], language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @ApiSecurity('JWT-auth')
  @Post('/logout')
  @ApiOperation({
    summary: 'Permite cerrar la sesión',
    description: "Permite cerrar la sesión del usuario"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiOkResponse({
    description: "Sesión cerrada exitosamente",
    type: LogoutOkDto
  }
  )
  @ApiBadRequestResponse({
    description: "Petición incorrecta",
    type: LogoutBadRequestDto
  })
  @ApiUnauthorizedResponse({
    description: "Token no enviado",
    type: UnauthorizedDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseGuards(ValidateTokenGuard)
  @UseInterceptors(FormatSingleValidationInterceptor)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_LOGOUT || '3'), ttl: 60000 } })
  async logout(@Query() language: LanguageDto, @Body() tokenFcm: TokenFcmDto, @Req() request: Request, @Res() response: Response) {
    const data: ResponseApi = await this.authService.logout(tokenFcm.token_fcm, request.headers["authorization"], language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @ApiSecurity('JWT-auth')
  @Delete('/delete')
  @ApiOperation({
    summary: 'Permite eliminar la cuenta del usuario',
    description: "Permite eliminar los registros asociados al usuario"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiOkResponse({
    description: "Sesión cerrada exitosamente",
    type: DeleteOKDto
  }
  )
  @ApiUnauthorizedResponse({
    description: "Token no enviado",
    type: UnauthorizedDto
  })
  @ApiInternalServerErrorResponse({
    description: "Error interno del servidor",
    type: InternalServerDto
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseGuards(ValidateTokenGuard)
  @UseInterceptors(FormatSingleValidationInterceptor)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_DELETE || '3'), ttl: 60000 } })
  async deleteUser(@Query() language: LanguageDto, @Req() request: Request, @Res() response: Response): Promise<Response> {
    const data: ResponseApi = await this.authService.delete(request.headers["authorization"], language.lang);
    return response.status(data.statusCode).json(data.response);
  };
}