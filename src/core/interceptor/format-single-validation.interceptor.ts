import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { CustomResponse } from 'src/shared/response/customResponse';

@Injectable()
export class FormatSingleValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    let language = request.query.lang;

    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BadRequestException) {
          const response = error.getResponse() as any;
          const customResponse = new CustomResponse();
          if (response && Array.isArray(response.message) && response.message.length > 0) {
            const value = response.message[0];
            const field = value.property;
            const key = Object.keys(value.constraints)[0];
            return throwError(() => new BadRequestException({
              message: customResponse.responseValidation(key, field, language)
            }));
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
