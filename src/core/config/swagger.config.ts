import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

export class SwaggerConfig {
  constructor(private readonly configService: ConfigService) { }
  setup(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle(this.configService.get<string>('APP_NAME') || 'Contratalo')
      .setDescription(this.configService.get<string>('APP_DESCRIPTION') || 'Documentación de la API REST Contratalo')
      .setVersion(this.configService.get<string>('APP_VERSION') || '1.0')
      .addServer(this.configService.get<string>('SWAGGER_SERVER') || 'http://localhost:3000/api/v1')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Introduce el token JWT'
        },
        'JWT-auth'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(this.configService.get<string>('SWAGGER_PATH') || 'swagger/contratalo', app, document, {
      customSiteTitle: this.configService.get<string>('SWAGGER_CUSTOM') || 'Contratalo',
    });
    app.use(
      '/scalar/contratalo',
      apiReference({
        content: document,
      }),
    )
  }
}