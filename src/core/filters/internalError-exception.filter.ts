import { ArgumentsHost, Catch, ExceptionFilter, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalErrorFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) 
  {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse['message']) {
      message = exceptionResponse['message'];
    } else {
      message = 'Internal server error';
    }

    response.status(status).json({
      message: message,
    });
  }
  }
