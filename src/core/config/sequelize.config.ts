import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => {
  const isDevelopment = configService.get('NODE_ENV') === 'development';

  return {
    dialect: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'password'),
    database: configService.get<string>('DB_DATABASE', 'nest_api'),
    autoLoadModels: true,
    synchronize: true,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
      evict: 100,
    },
    dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    logging: isDevelopment ? console.log : false,
  };
};