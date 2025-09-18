import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { CustomResponse } from 'src/shared/response/customResponse';

@Injectable()
export class FormatManyValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    let language = request.query.lang;

    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BadRequestException) {
          const response = error.getResponse() as any;
          if (response && Array.isArray(response.message)) {
            const errors = {};
            const customResponse = new CustomResponse();
            response.message.forEach((value) => {
              const field = value.property;
              if (field && !errors[field]) {
                const message = Object.keys(value.constraints)[0];
                errors[field] = customResponse.responseValidation(message, field, language)
              }
            });

            return throwError(() => new BadRequestException({ errors }));
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
