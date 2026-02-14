import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

import { CoreModule } from './core/core.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { IdentityModule } from './modules/identity/identity.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { SurveyModule } from './modules/survey/survey.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

import appConfig from './infrastructure/config/app.config';
import databaseConfig from './infrastructure/config/database.config';
import redisConfig from './infrastructure/config/redis.config';
import jwtConfig from './infrastructure/config/jwt.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, jwtConfig],
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Queue system
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB', 0),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
      inject: [ConfigService],
    }),

    // Core modules
    CoreModule,
    InfrastructureModule,

    // Domain modules
    IdentityModule,
    TenantModule,
    ComplianceModule,
    SurveyModule,
    AnalyticsModule,
  ],
})
export class AppModule {}