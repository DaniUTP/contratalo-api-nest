import { Body, Controller, Patch, Post, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { FormatManyValidationInterceptor } from 'src/core/interceptor/format-many-validation.interceptor';
import { ApiBadRequestResponse, ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InternalServerDto } from 'src/shared/dto/internalError.dto';
import { UnauthorizedDto } from 'src/shared/dto/unauthorized.dto';
import { UserService } from '../service/user.service';
import { CreateOkDto } from '../dto/response/create/createOk.dto';
import { CreateBadRequestDto } from '../dto/response/create/createBadRequest.dto';
import { CreateUserDto } from '../dto/request/create.dto';
import { UpdateOkDto } from '../dto/response/update/updateOk.dto';
import { UpdateBadRequestDto } from '../dto/response/update/updateBadRequest.dto';
import { UpdateUserDto } from '../dto/request/update.dto';
import { LanguageDto } from 'src/shared/dto/language.dto';
import { ResponseApi } from 'src/shared/response/responseApi';
import { Throttle } from '@nestjs/throttler';
import { RatelimitDto } from 'src/shared/dto/rateLimit.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @ApiOperation({
    summary: 'Permite registrar un nuevo usuario',
    description: "Registra un nuevo usuario en la base de datos"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiOkResponse({
    type: CreateOkDto,
    description: 'Mensaje de éxito'
  })
  @ApiBadRequestResponse({
    type: CreateBadRequestDto,
    description: 'Error en la solicitud'
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerDto,
    description: 'Error en el servidor'
  })
  @ApiBody({ type: CreateUserDto })
  @Post('/')
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseInterceptors(FormatManyValidationInterceptor)
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_REGISTER || '2'), ttl: 60000 } })
  async accountRegistration(@Query() language: LanguageDto, @Body() userDto: CreateUserDto, @Res() response: Response) {
    const data: ResponseApi = await this.userService.create(userDto, language.lang);
    return response.status(data.statusCode).json(data.response);
  };

  @ApiOperation({
    summary: 'Permite actualizar el perfil de un usuario',
    description: "Actualiza el perfil de un usuario en la base de datos"
  })
  @ApiQuery({
    name: 'lang',
    description: 'Idioma',
    required: false
  })
  @ApiOkResponse({
    type: UpdateOkDto,
    description: 'Mensaje de éxito'
  })
  @ApiBadRequestResponse({
    type: UpdateBadRequestDto,
    description: 'Error en la solicitud'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiSecurity('JWT-auth')
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Error de autenticación'
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerDto,
    description: 'Error en el servidor'
  })
  @ApiTooManyRequestsResponse({
    description: "Limite de petición excedido",
    type: RatelimitDto
  })
  @UseInterceptors(FormatManyValidationInterceptor)
  @Patch('/')
  @Throttle({ default: { limit: parseInt(process.env.RATELIMIT_UPDATE_PROFILE || '2'), ttl: 60000 } })
  async updateProfile(@Query() language: LanguageDto, @Req() request: Request, @Body() userDto: UpdateUserDto, @Res() response: Response) {
    const data: ResponseApi = await this.userService.update(userDto, request.headers["authorization"], language.lang);
    return response.status(data.statusCode).json(data.response);
  };
}