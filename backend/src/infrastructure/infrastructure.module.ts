import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { EncryptionModule } from './encryption/encryption.module';
import { TenantAwareDataSource } from './database/tenant-aware.datasource';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'cumplehub'),
        schema: 'shared',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('DB_SSL') === 'true' ? {
          rejectUnauthorized: false,
        } : false,
        extra: {
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    EncryptionModule,
  ],
  providers: [TenantAwareDataSource],
  exports: [TypeOrmModule, LoggerModule, EncryptionModule, TenantAwareDataSource],
})
export class InfrastructureModule {}