import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '@infrastructure/logger/logger.service';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  code: string;
  timestamp: string;
  path: string;
  requestId?: string;
  details?: Record<string, unknown>;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = request.headers['x-request-id'] as string || this.generateRequestId();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';
    let details: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | { message: string | string[]; error?: string; code?: string; details?: Record<string, unknown> };

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = exceptionResponse.message || message;
        error = exceptionResponse.error || error;
        code = exceptionResponse.code || this.getErrorCode(status);
        details = exceptionResponse.details;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      code = 'UNKNOWN_ERROR';
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
      ...(details && { details }),
    };

    // Log error
    this.logger.error(
      `[${requestId}] ${request.method} ${request.url} - ${status}: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : undefined,
      'GlobalExceptionFilter',
    );

    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production' && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorResponse.message = 'Internal server error';
      delete errorResponse.details;
    }

    response.status(status).json(errorResponse);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
      [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMIT_EXCEEDED',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
    };
    return codeMap[status] || 'UNKNOWN_ERROR';
  }
}