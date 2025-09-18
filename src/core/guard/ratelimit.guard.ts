import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CustomResponse } from 'src/shared/response/customResponse';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  private readonly customResponse = new CustomResponse();

  protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: any): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const language = request.query?.lang || 'es';

    const message = this.customResponse.translateMessages('rateLimit', language);

    response.status(429).json({
      message: message
    });

    throw new Error('Throttling exception');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(context);
    } catch (error) {
      if (error.message === 'Throttling exception') {
        return false;
      }
      throw error;
    }
  }
}