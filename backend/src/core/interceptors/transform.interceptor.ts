import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
  requestId?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers['x-request-id'] as string;

    return next.handle().pipe(
      map((data) => {
        // If data is already wrapped, return as is
        if (data && typeof data === 'object' && 'data' in data) {
          return {
            ...data,
            timestamp: new Date().toISOString(),
            ...(requestId && { requestId }),
          };
        }

        // Wrap the response
        return {
          data,
          timestamp: new Date().toISOString(),
          ...(requestId && { requestId }),
        };
      }),
    );
  }
}