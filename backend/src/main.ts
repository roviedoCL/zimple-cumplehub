import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { LoggerService } from './infrastructure/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  app.use(compression());

  // CORS configuration
  const allowedOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
  });

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Zimple CumpleHub API')
    .setDescription('API documentation for Zimple CumpleHub - Compliance and Organizational Climate Platform')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-Tenant-ID',
        in: 'header',
        description: 'Tenant identifier',
      },
      'X-Tenant-ID',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  await app.listen(port);

  logger.log(
    `🚀 Zimple CumpleHub API is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  logger.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api/docs`,
    'Bootstrap',
  );
  logger.log(`🔧 Environment: ${nodeEnv}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});