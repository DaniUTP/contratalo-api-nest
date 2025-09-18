import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './core/config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedExceptionFilter } from './core/filters/unauthorized-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { InternalErrorFilter } from './core/filters/internalError-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new SwaggerConfig(app.get(ConfigService));
  swaggerConfig.setup(app);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new UnauthorizedExceptionFilter(), new InternalErrorFilter());
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const result = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints
      }));
      return new BadRequestException(result);
    },
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
