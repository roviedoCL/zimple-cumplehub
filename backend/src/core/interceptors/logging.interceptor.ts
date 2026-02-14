import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '@infrastructure/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const requestId = headers['x-request-id'] as string || this.generateRequestId();
    const userAgent = headers['user-agent'] || 'unknown';
    const ip = headers['x-forwarded-for'] || request.ip;

    const now = Date.now();
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;

    this.logger.log(
      `[${requestId}] Incoming Request: ${method} ${url} - ${controllerName}.${handlerName}`,
      'LoggingInterceptor',
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;

          this.logger.log(
            `[${requestId}] Response: ${method} ${url} ${statusCode} - ${duration}ms`,
            'LoggingInterceptor',
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          const statusCode = error.status || 500;

          this.logger.error(
            `[${requestId}] Error Response: ${method} ${url} ${statusCode} - ${duration}ms - ${error.message}`,
            error.stack,
            'LoggingInterceptor',
          );
        },
      }),
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}